export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);
        // Perisist data into local storage
        this.persistData();
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        // Perisist data into local storage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    getNumLikes() {
        return this.likes.length;
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) {
            this.likes = storage;
            // Restore likes from the local storage
        }
    }
}