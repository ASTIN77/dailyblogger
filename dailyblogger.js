// --- TheDailyBlogger (Node 22 + Mongoose 8 + sessions) ---

require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const Blog = require('./models/blog');

// --- Mongo connection ---
const MONGO_URI = process.env.BLOGGERURL;
if (!MONGO_URI) {
  throw new Error('No MongoDB connection string found in env (expected BLOGGERURL or MONGO_URI)');
}
async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Mongo connected (TheDailyBlogger)');
}

// --- Express setup ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 3002);

app.use(express.static(path.join(__dirname, 'public')));

// Body parser first
app.use(express.urlencoded({ extended: true }));

// Sanitizer (you call req.sanitize later in routes)
app.use(expressSanitizer());

// Method override that supports both hidden field and query string
app.use(methodOverride(function (req, res) {
  // Hidden field: <input type="hidden" name="_method" value="PUT">
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = String(req.body._method || '').toUpperCase();
    delete req.body._method; // keep body clean
    return method; // e.g. 'PUT' or 'DELETE'
  }
  // Query string: /path?_method=DELETE
  if (req.query && typeof req.query._method === 'string') {
    return req.query._method.toUpperCase();
  }
  return undefined;
}));

// --- Session setup ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'IrnBru32Phenomenal',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // TLS terminated upstream
    },
  })
);

// --- Helper: normalize a doc for templates (guarantee .id) ---
function asViewModel(doc) {
  if (!doc) return null;
  const o = doc.toObject({ virtuals: true, getters: true });
  if (!o.id && o._id) o.id = String(o._id);
  return o;
}

// --- Routes ---

// Index redirect
app.get('/', (req, res) => res.redirect('/blogs'));

// List all blogs (newest first)
app.get('/blogs', async (req, res) => {
  try {
    const docs = await Blog.find({})
      .sort({ created: -1, _id: -1 }); // desc by date, then by id
    const blogs = docs.map(asViewModel);
    res.render('index', { blogs });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// New blog form
app.get('/blogs/new', (req, res) => res.render('new'));

// Create blog
app.post('/blogs', async (req, res) => {
  try {
    if (req.body?.blog?.body) {
      req.body.blog.body = req.sanitize(req.body.blog.body);
    }
    await Blog.create(req.body.blog);
    res.redirect('/blogs');
  } catch (err) {
    console.error(err);
    res.render('new');
  }
});

// Show blog
app.get('/blogs/:id', async (req, res) => {
  try {
    const doc = await Blog.findById(req.params.id);
    const blog = asViewModel(doc);
    if (!blog) return res.redirect('/blogs');
    res.render('show', { blog });
  } catch (err) {
    console.error(err);
    res.redirect('/blogs');
  }
});

// Edit blog
app.get('/blogs/:id/edit', async (req, res) => {
  try {
    const doc = await Blog.findById(req.params.id);
    const blog = asViewModel(doc);
    if (!blog) return res.redirect('/blogs');
    res.render('edit', { blog });
  } catch (err) {
    console.error(err);
    res.redirect('/blogs');
  }
});

// Update blog (PUT via method-override)
app.put('/blogs/:id', async (req, res) => {
  try {
    if (req.body?.blog?.body) {
      req.body.blog.body = req.sanitize(req.body.blog.body);
    }
    await Blog.findByIdAndUpdate(req.params.id, req.body.blog, { runValidators: true });
    res.redirect('/blogs/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.redirect('/blogs');
  }
});

// Destroy blog (DELETE via method-override)
app.delete('/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/blogs');
  } catch (err) {
    console.error(err);
    res.redirect('/blogs');
  }
});

// --- Boot ---
connectDB()
  .then(() => {
    app.listen(app.get('port'), () => {
      console.log(`🚀 TheDailyBlogger listening on ${app.get('port')}`);
    });
  })
  .catch((err) => {
    console.error('❌ Mongo connection error:', err);
    process.exit(1);
  });

