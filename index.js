
// framework
const express = require("express");

// database 
const database = require("./database/index");


// initializing
const bookapi = express();

// configurations
bookapi.use(express.json());


/*
Route           /books
Description     to get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/

bookapi.get("/books", (req, res) => {
    return res.json(database.books);
});

/*
Route           /is
Description     to get specific book by ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/

bookapi.get("/is/:isbn", (req, res) => {

    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn);

    if (getSpecificBook.length === 0) {
        return res.json({
            error: `NO BOOK FOUND FOR ISBN ${req.params.isbn}`
        });
    }
    return res.json({ book: getSpecificBook });
});


/*
Route           /c/:category
Description     to get specific book by category
Access          PUBLIC
Parameters      category
Method          GET
*/

bookapi.get("/c/:category", (req, res) => {
    const getSpecificBooks = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );

    if (getSpecificBooks.length === 0) {
        return res.json({
            error: `NO BOOK FOUND FOR THE CATEGORY ${req.params.category}`
        });
    }

    return res.json({ books: getSpecificBooks });
});


/*
Route           /a/:authorId
Description     to get all books by author id
Access          PUBLIC
Parameters      authorid
Method          GET
*/

bookapi.get("/a/:authorid", (req, res) => {
    const getBooksByAuthorId = database.books.filter(
        (book) => book.authors.includes(parseInt(req.params.authorid)));

    if (getBooksByAuthorId.length === 0) {
        return res.json({ error: `NO BOOKS FOUND FOR THE AUTHOR ${req.params.authorid}` });
    }

    return res.json({ books: getBooksByAuthorId });

});


/*
Route           /authors
Description     to get all authors
Access          PUBLIC
Parameters      none
Method          GET
*/

bookapi.get("/author", (req, res) => {
    return res.json({ authors: database.authors });
});

/*
Route           /au/auname
Description     to get specific author
Access          PUBLIC
Parameters      name
Method          GET
*/

bookapi.get("/au/:auname", (req, res) => {
    const getSpecificAuthor = database.authors.filter(
        (authorname) => authorname.name === req.params.auname);

    if (getSpecificAuthor.length === 0) {
        return res.json({
            error: `NO BOOK FOUND BY AUTHOR ${req.params.auname}`
        });
    }

    return res.json({ authors: getSpecificAuthor });
});

/*
Route           /author
Description     to get author by specific book isbn
Access          PUBLIC
Parameters      isbn
Method          GET
*/

bookapi.get("/author/:isbn", (req, res) => {
    const getAuthorByISBN = database.authors.filter(
        (author) => author.books.includes(req.params.isbn));
    if (getAuthorByISBN.length === 0) {
        return res.json(
            { error: `NO AUTHOR FOUND FOR BOOK'S ISBN ${req.params.isbn}` });
    }
    return res.json({ authors: getAuthorByISBN });
});

/*
Route           /publications
Description     to get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/

bookapi.get("/publications", (req, res) => {
    return res.json({ publications: database.publications });
});

/*
Route           /publications/
Description     to get a specific publication
Access          PUBLIC
Parameters      id
Method          GET
*/

bookapi.get("/publications/:id", (req, res) => {
    const getPublicationById = database.publications.filter(
        (pub) => pub.id === parseInt(req.params.id));
    if (getPublicationById.length === 0) {
        return res.json({ error: `NO PUBLICATION FOUND BY ID ${req.params.id}` });
    }

    return res.json({ publication: getPublicationById });
});

/*
Route           /publications/
Description     to get a specific publication
Access          PUBLIC
Parameters      isbn
Method          GET
*/

bookapi.get("/pub/:isbn", (req, res) => {
    const getPublicationByIsbn = database.publications.filter(
        (pub) => pub.books.includes(req.params.isbn));

    if (getPublicationByIsbn.length === 0) {
        return res.json({ error: `NO PUBLICATION FOUND FOR BOOKS WITH ISBN ${req.params.isbn}` });

    }

    return res.json({ publications: getPublicationByIsbn });
});

/*
Route           /book/new
Description     to add new book
Access          PUBLIC
Parameters      NONE
Method          POST
*/
bookapi.post("/book/new", (req, res) => {
    const { newBook } = req.body;

    database.books.push(newBook);

    return res.json({ books: database.books, message: "Book was Added!" });
});

/*
Route           /author/new
Description     to add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/

bookapi.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;
    database.authors.push(newAuthor);
    return res.json(
        { authors: database.authors, message: "Author was Added" }
    );

});

/*
Route           /publications/new
Description     to add new publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/

bookapi.post("/publications/new", (req, res) => {
    const { newPublication } = req.body;
    database.publications.push(newPublication);
    return res.json(
        { publications: database.publications, message: "Publication was Added" }
    );

});

/*
Route           /book/update/
Description     to update book details (title)
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

bookapi.put("/book/update/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    });

    res.json({ books: database.books });
});

/*
Route           /book/author/update/
Description     update/add author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

bookapi.put("/book/author/update/:isbn", (req, res) => {
    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn)
            return book.authors.push(req.body.newAuthor);
    });

    // update the author database
    database.authors.forEach((author) => {
        if (author.id === req.body.newAuthor)
            return author.books.push(req.params.isbn);
    });

    return res.json({
        books: database.books,
        authors: database.authors,
        message: "New Author was added"
    });

});

/*
Route           /book/author/update/
Description     update author name by id
Access          PUBLIC
Parameters      id
Method          PUT
*/

bookapi.put("/author/updatename/:id", (req, res) => {
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.id)) {
            author.name = req.body.authorName;
            return;
        }
    });

    return res.json({ authors: database.authors });
});

/*
Route           /publication/name/update/
Description     update publication name by id
Access          PUBLIC
Parameters      id
Method          PUT
*/

bookapi.put("/publication/name/update/:id", (req, res) => {
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.params.id)) {
            publication.name = req.body.publicationName;
            return;
        }
    });

    return res.json({ publications: database.publications });
});

/*
Route           /publication/update/book
Description     update/add new book to publication
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

bookapi.put("/publication/update/book/:isbn", (req, res) => {

    // update publication database
    database.publications.forEach((publication) => {
        if (publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }
    });

    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });

    return res.json({
        book: database.books,
        publications: database.publications,
        message: "successfully updated publication"
    })
});

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/

bookapi.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );

    database.books = updatedBookDatabase;
    return res.json({ books: database.books });
});

/*
Route           /book/delete/author
Description     delete a author from book
Access          PUBLIC
Parameters      isbn,authorId
Method          DELETE
*/

bookapi.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    // update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter(
                (author) => author !== parseInt(req.params.authorId));
            book.authors = newAuthorList;
            return;
        }
    });

    // update the author database
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            const newBooksList = author.books.filter(
                (book) => book !== req.params.isbn);
            author.books = newBooksList;
            return;
        }
    });

    return res.json({
        message: "Author was deleted",
        book: database.books,
        author: database.authors
    });
});

/*
Route           /author/delete
Description     delete a author from book
Access          PUBLIC
Parameters      id
Method          DELETE
*/

bookapi.delete("/author/delete/:id", (req, res) => {
    const updatedAuthorDatabase = database.authors.filter(
        (author) => author.id !== parseInt(req.params.id)
    );

    database.authors = updatedAuthorDatabase;
    return res.json({ authors: database.authors });
});

/*
Route           /publication/delete/book
Description     delete a book from publication
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/

bookapi.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
    // update publication database
    database.publications.forEach(
        (publication) => {
            if (publication.id === parseInt(req.params.pubId)) {
                const newBooksList = publication.books.filter(
                    (book) => book !== req.params.isbn);
                publication.books = newBooksList;
                return;
            }
        });

    // update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = 0; //no publication available
            return;
        }
    });

    return res.json({ books: database.books, publication: database.publications });
});

/*
Route           /publication/delete
Description     delete a publication
Access          PUBLIC
Parameters      id
Method          DELETE
*/

bookapi.delete("/publication/delete/:id", (req, res) => {
    const updatedPublicationDatabase = database.publications.filter(
        (publication) => publication.id !== parseInt(req.params.id)
    );

    database.publications = updatedPublicationDatabase;
    return res.json({ publications: database.publications });
});

// listening port for server
bookapi.listen(3000, () => console.log("Server Running"));