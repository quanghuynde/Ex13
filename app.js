const express = require("express");

const {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} = require("./operation");

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET all articles
app.get("/articles", async (req, res) => {
    try {
        const articles = await getArticles();

        res.json(articles);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Cannot get articles"
        });
    }
});

// GET article by ID
app.get("/articles/:id", async (req, res) => {
    try {
        const article = await getArticleById(req.params.id);

        if (!article) {
            return res.status(404).json({
                error: "Article not found"
            });
        }

        res.json(article);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Cannot get article"
        });
    }
});

// POST article
app.post("/articles", async (req, res) => {
    try {
        const { title, date, text } = req.body;

        const article = {
            title: title,
            date: date,
            text: text
        };

        const newArticle = await createArticle(article);

        res.status(201).json(newArticle);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Cannot create article"
        });
    }
});

// PUT article
app.put("/articles/:id", async (req, res) => {
    try {
        const { title, date, text } = req.body;

        const result = await updateArticle(
            req.params.id,
            {
                title: title,
                date: date,
                text: text
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: "Article not found"
            });
        }

        res.json({
            message: "Article updated successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Cannot update article"
        });
    }
});

// DELETE article
app.delete("/articles/:id", async (req, res) => {
    try {
        const result = await deleteArticle(req.params.id);

        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: "Article not found"
            });
        }

        res.json({
            message: "Article deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Cannot delete article"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});