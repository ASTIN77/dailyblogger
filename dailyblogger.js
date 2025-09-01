// --- TheDailyBlogger (Node 22 + Mongoose 8 + sessions) ---

// Load env first
require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');

// Session/auth deps
const session = require('express-session');
const MongoStore = require('connect-mongo');

const Blog = require('./models/blog');

// --- Mongo connection ---
const MONGO_URI =
  process.env.BLOGGERURL;;

if (!MONGO_URI) {
  throw new Error('No MongoDB connection string found in env (expected BLOGGERURL or MONGO_URI)');
}

async function connectDB() {
  await mongoose.connect(MONGO_URI); // Mongoose 8, no legacy options
  console.log('✅ Mongo connected (TheDailyBlogger)');
}

// --- Express setup ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 3002);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

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
      secure: false, // Cloudflare/NGINX terminates TLS, keep false here
    },
  })
);

// --- Routes ---

// Index redirect
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// List all blogs
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({}).lean();
    res.render('index', { blogs });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// New blog form
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

// Create blog
app.post('/blogs', async (req, res) => {
  try {
    req.body.blog.body = req.sanitize(req.body.blog.body);
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
    const foundBlog = await Blog.findById(req.params.id).lean();
    if (!foundBlog) return res.redirect('/blogs');
    res.render('show', { blog: foundBlog });
  } catch (err) {
    console.error(err);
    res.redirect('/blogs');
  }
});

// Edit blog
app.get('/blogs/:id/edit', async (req, res) => {
  try {
    const foundBlog = await Blog.findById(req.params.id).lean();
    if (!foundBlog) return res.redirect('/blogs');
    res.render('edit', { blog: foundBlog });
  } catch (err) {
    console.error(err);
    res.redirect('/blogs');
  }
});

// Update blog
app.put('/blogs/:id', async (req, res) => {
  try {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    await Blog.findByIdAndUpdate(req.params.id, req.body.blog);
    res.redirect('/blogs/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.redirect('/blogs');
  }
});

// Destroy blog
app.delete('/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndRemove(req.params.id);
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
