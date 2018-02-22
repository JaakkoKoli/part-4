const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.length === 0 ? 0 : blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return (null)
    }
    blog = blogs[0]
    blogs.forEach(b => blog = blog.likes < b.likes ? b : blog)
    return (blog)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return (null)
    }
    authors = []
    amount = []
    blogs.forEach(b => {
        if (authors.find(a => a === b.author)) {
            for (i = 0; i < authors.length; i++) {
                if (authors[i] === b.author) {
                    amount[i]++
                }
            }
        } else {
            authors=authors.concat(b.author)
            amount=amount.concat(1)
        }
    })
    n = 0
    x = 0
    for (i = 0; i < amount.length; i++) {
        if (amount[i] > x) {
            x = amount[i]
            n = i
        }
    }
    return {author: authors[n], blogs: amount[n]}
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return (null)
    }
    authors = []
    amount = []
    blogs.forEach(b => {
        if (authors.find(a => a === b.author)) {
            for (i = 0; i < authors.length; i++) {
                if (authors[i] === b.author) {
                    amount[i]+=b.likes
                }
            }
        } else {
            authors=authors.concat(b.author)
            amount=amount.concat(b.likes)
        }
    })
    n = 0
    x = 0
    for (i = 0; i < amount.length; i++) {
        if (amount[i] > x) {
            x = amount[i]
            n = i
        }
    }
    return {author: authors[n], likes: amount[n]}
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}