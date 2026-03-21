const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve MP3 files from songs folder
app.use('/songs', express.static(path.join(__dirname, 'songs')));

// ── MongoDB Connection ──
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://harshjha589_db_user:gJquwRIIo26kn4YY@cluster0.zodzwqv.mongodb.net/sonichub?appName=Cluster0';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ── Song Schema ──
const songSchema = new mongoose.Schema({
  rank:     Number,
  title:    String,
  artist:   String,
  genre:    String,
  duration: String,
  file:     String,   // MP3 filename
  plays:    { type: Number, default: 0 },
  likes:    { type: Number, default: 0 },
  trending: { type: Boolean, default: false },
});

const Song = mongoose.model('Song', songSchema);

// ── Seed Data ──
async function seedData() {
  const count = await Song.countDocuments();
  if (count > 0) return;

  const songs = [
    { rank:1,  title:'Tu Banja Gali Benaras Ki', artist:'Asees Kaur',           genre:'Devotional', duration:'4:12', file:'409081-asees-kaur---tu-banja-gali-benaras-ki-feat.-asees-kaur.mp3',                                                                                trending:true  },
    { rank:2,  title:'Baithe Baithe',             artist:'Aishwarya Pandit',     genre:'Romantic',   duration:'3:45', file:'524094-aishwarya-pandit---baithe-baithe.mp3',                                                                                                      trending:false },
    { rank:3,  title:'Tujh Mein Rab Dikhta Hai', artist:'Roop Kumar Rathod',    genre:'Bollywood',  duration:'5:10', file:'540056-127978-tujh-mein-rab-dikhta-hai-song-_-rab-ne-bana-di-jodi-_-shah-rukh-khan,-anushka-sharma-_-roop-kumar.mp3',                              trending:true  },
    { rank:4,  title:'Tere Sang Yaara (Remix)',   artist:'Atif Aslam',           genre:'Romantic',   duration:'4:30', file:'666910-atif-aslam---tere-sang-yaara---remix.mp3',                                                                                                  trending:true  },
    { rank:5,  title:'Marziyan',                  artist:'Arijit Singh',         genre:'Romantic',   duration:'4:05', file:'Arijit_Singh_s_New_Romantic_Song__Marziyan__-_The_Love_Anthem_That_Will_Make_You_Fall_in_Love!(256k).mp3',                                          trending:true  },
    { rank:6,  title:'Ishq Hai Tamil Kadhale',    artist:'Armaan Malik, Shreya', genre:'Fusion',     duration:'3:55', file:'Hindi_Ishq_hai_Tamil_Kadhale_lyrics___Nodivalandava_Lyrics__Arjun_Janya___Armaan_Malik,Shreya_Ghosal(256k).mp3',                                    trending:false },
    { rank:7,  title:'Hoshwalon Ko Khabar Kya',  artist:'Jagjit Singh',         genre:'Ghazal',     duration:'6:20', file:'Hoshwalon_Ko_Khabar_Kya___JAGJIT_SINGH___Sarfarosh___1999(128k).mp3',                                                                              trending:false },
    { rank:8,  title:'Kahani Meri',               artist:'Kaifi Khalil',         genre:'Indie',      duration:'3:40', file:'Kahani_Meri_official_Lyrical_Video___kaifi_Khalil___Anmol_Daniel_I_Novice_Records(128k).mp3',                                                       trending:true  },
    { rank:9,  title:'Barbaad (Saiyaara)',        artist:'Jubin Nautiyal',       genre:'Romantic',   duration:'4:15', file:'Lyrical___Barbaad_Song___Saiyaara___Ahaan_Panday,_Aneet_Padda___The_Rish___Jubin_Nautiyal(256k).mp3',                                               trending:true  },
    { rank:10, title:'Aaoge Jab Tum',             artist:'Ustad Rashid Khan',    genre:'Classical',  duration:'5:30', file:'Lyrical__Aaoge_Jab_Tum___Jab_We_Met___Kareena__Kapoor,_Shahid_Kapoor___Ustad_Rashid_Khan(128k).mp3',                                               trending:false },
    { rank:11, title:'Main Pal Do Pal Ka Shayar', artist:'Mukesh, Amitabh',      genre:'Classic',    duration:'4:50', file:'Main_Pal_Do_Pal_Ka_Shayar_Hoon____Jhankar____Mukesh_Chand_Mathur,_Amitabh_Bachchan___Shashi_Kapoor(256k).mp3',                                     trending:false },
    { rank:12, title:'Bollywood Mix',             artist:'Various Artists',      genre:'Bollywood',  duration:'3:20', file:'mondamusic-bollywood-indian-hindi-song-music-499178.mp3',                                                                                            trending:false },
    { rank:13, title:'Rubaru',                    artist:'Vishal Mishra',        genre:'Romantic',   duration:'4:00', file:'Rubaru___Khuda_Haafiz_2___Vidyut_J,_Shivaleeka_O___Vishal_Mishra,_Asees_Kaur,_Manoj_M___Lyrical(256k).mp3',                                         trending:true  },
    { rank:14, title:'The Mountain',              artist:'Instrumental',         genre:'Ambient',    duration:'3:10', file:'the_mountain-indian-hindi-background-music-496551.mp3',                                                                                              trending:false },
  ];

  await Song.insertMany(songs);
  console.log('✅ 14 songs seeded');
}

// ── API Routes ──

// GET all songs
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find().sort({ rank: 1 });
    res.json({ success: true, data: songs });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET trending songs
app.get('/api/songs/trending', async (req, res) => {
  try {
    const songs = await Song.find({ trending: true }).sort({ rank: 1 });
    res.json({ success: true, data: songs });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST like a song
app.post('/api/songs/:id/like', async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json({ success: true, likes: song.likes });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST increment play count
app.post('/api/songs/:id/play', async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { plays: 1 } },
      { new: true }
    );
    res.json({ success: true, plays: song.plays });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

mongoose.connection.once('open', seedData);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎵 SONIC HUB running at http://localhost:${PORT}`);
});