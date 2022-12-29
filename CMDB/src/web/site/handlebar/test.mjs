import express from "express";
import path from "path";
import url from "url";
const PORT = 8081;

const app = express();
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


app.use(express.json());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index', {
            people:[
            {
                name: "John",
                age: 30,
            },
            {
                name: "Mary",
                age: 40,
            },
            {
                name: "Peter",
                age: 20,
            }
             ]
        });
})
app.listen(PORT, () => console.log(`[S] Server listening in http://localhost:${PORT}`) );
