import express from 'express';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});