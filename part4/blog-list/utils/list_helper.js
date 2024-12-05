const _ = require('lodash')

const dummy = blogs => {
    return 1
}

const totalLikes = blogs => {
    return blogs.reduce((acc, val) => acc + val.likes, 0)
}

const favoriteBlog = blogs => {
    if (blogs.length == 0) return undefined

    return blogs.reduce((max, cur) => cur.likes > max.likes ? cur : max)
}

const mostBlogs = blogs => {
    if (blogs.length == 0) return undefined

    const counted = _.countBy(blogs, 'author')
    maxAuthor =  _.max(_.entries(counted), _.last)
    return { author: maxAuthor[0], blogs: maxAuthor[1] }
}

const mostLikes = blogs => {
    if (blogs.length == 0) return undefined

    result = _.chain(blogs) //Chain calls with value() at last
              .groupBy('author') //Group by author
              .mapValues(group => _.sumBy(group, 'likes')) //Sum all likes
              .entries() // transform object into [key, value] pairs
              .maxBy(_.last) // Get maximum from last element
              .value() // return value
    
    return { author: result[0], likes: result[1] }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}