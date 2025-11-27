import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get poll by ID
app.get('/api/polls/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: poll, error: pollError } = await supabase
      .from('poll')
      .select('*, owners(*)')
      .eq('id', id)
      .single();

    if (pollError) throw pollError;

    const { data: items, error: itemsError } = await supabase
      .from('poll_items')
      .select('*')
      .eq('poll_id', id)
      .order('position');

    if (itemsError) throw itemsError;

    // Calculate time remaining
    const endsAt = new Date(poll.closes_at);
    const now = new Date();
    const diff = endsAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const endsIn = diff > 0 ? `${hours}h ${minutes}m` : 'Ended';

    res.json({
      id: poll.id,
      title: poll.title,
      question: poll.description,
      endsIn,
      totalVotes: items.reduce((sum, item) => sum + (item.votes || 0), 0),
      restaurant: {
        name: poll.owners?.restaurant_name || 'Restaurant',
        location: 'Local Area',
        description: 'Helping decide the next menu item!',
        avatar: poll.owners?.restaurant_logo_url || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&q=80',
        website: ''
      },
      items: items.map(item => ({
        id: item.id,
        name: item.item_name,
        description: item.item_description || '',
        image: item.image_url,
        price: item.price ? `$${item.price}` : '',
        votes: item.votes || 0
      }))
    });
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create poll
app.post('/api/polls/create', upload.fields([
  { name: 'itemA_image', maxCount: 1 },
  { name: 'itemB_image', maxCount: 1 }
]), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { title, question, duration } = req.body;
    const files = req.files;

    // Upload images
    const uploadImage = async (file, path) => {
      const { error } = await supabase.storage
        .from('poll-images')
        .upload(path, file.buffer, { contentType: file.mimetype });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage
        .from('poll-images')
        .getPublicUrl(path);
      return publicUrl;
    };

    const timestamp = Date.now();
    const imageAUrl = await uploadImage(files.itemA_image[0], `${user.id}/${timestamp}-a`);
    const imageBUrl = await uploadImage(files.itemB_image[0], `${user.id}/${timestamp}-b`);

    // Calculate end time
    const durationMs = duration === '24h' ? 24 * 60 * 60 * 1000
                     : duration === '48h' ? 48 * 60 * 60 * 1000
                     : 7 * 24 * 60 * 60 * 1000;
    const closesAt = new Date(Date.now() + durationMs).toISOString();

    // Create poll
    const { data: poll, error: pollError } = await supabase
      .from('poll')
      .insert({
        owner_id: user.id,
        title,
        description: question || 'Which one are you ordering?',
        duration,
        closes_at: closesAt,
        is_active: true,
      })
      .select()
      .single();

    if (pollError) throw pollError;

    // Create poll items
    const { error: itemsError } = await supabase
      .from('poll_items')
      .insert([
        {
          poll_id: poll.id,
          item_name: req.body.itemA_name,
          item_description: req.body.itemA_desc,
          price: parseFloat(req.body.itemA_price) || 0,
          image_url: imageAUrl,
          position: 0,
        },
        {
          poll_id: poll.id,
          item_name: req.body.itemB_name,
          item_description: req.body.itemB_desc,
          price: parseFloat(req.body.itemB_price) || 0,
          image_url: imageBUrl,
          position: 1,
        }
      ]);

    if (itemsError) throw itemsError;

    res.json({ pollId: poll.id });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vote on poll
app.post('/api/polls/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { itemId } = req.body;

    // Get user if authenticated (optional)
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    // Insert vote
    const { error } = await supabase
      .from('votes')
      .insert({
        poll_id: id,
        poll_item_id: itemId,
        user_id: userId
      });

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ error: error.message });
  }
});

// Auth signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, restaurantName } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { restaurant_name: restaurantName } }
    });

    if (authError) throw authError;

    // Create owner record
    if (authData.user) {
      await supabase.from('owners').upsert({
        id: authData.user.id,
        restaurant_name: restaurantName,
        owner_name: email.split('@')[0],
        created_at: new Date().toISOString(),
      });
    }

    res.json({ success: true, session: authData.session });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

