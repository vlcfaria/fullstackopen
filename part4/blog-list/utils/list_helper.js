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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}