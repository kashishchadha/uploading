//basic set up 

import express from 'express';

import crypto from "crypto";
import cors from "cors";
import ImageKit from "imagekit";


const app = express();
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    
const port = 5000;

//image kit set up 
const PRIVATE_KEY = "private_5/ARehONYK445BdrCrBKuG4z0As="; 
const PUBLIC_KEY = "public_6zs43cGF7mB5I6m9bsVjGG7mQvw="; 

const imagekit = new ImageKit({
  publicKey: PUBLIC_KEY,
  privateKey: PRIVATE_KEY,
  urlEndpoint: "https://ik.imagekit.io/kashishchadha15" 
});

app.get("/auth", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.json({ ...result, publicKey: PUBLIC_KEY });
});

app.get("/list-files", async (req, res) => {
  try {
    const result = await imagekit.listFiles({
      path: "/upload",
      limit: 100,
      skip: 0
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});