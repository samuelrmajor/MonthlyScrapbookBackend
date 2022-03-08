//Takes in an array of blogs

const dummy = (blogs) => {
    return 1

}


const totalLikes = (blogs) => {
    const allLikes = blogs.reduce((sum, blog) => sum+blog.likes,0)
    return allLikes
}



const favoriteBlog = (blogs) => {
    return blogs.filter(x => x.likes === Math.max(...blogs.map(x => x.likes)))[0]

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}