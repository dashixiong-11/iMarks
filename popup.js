console.log('pop.log');
const divMarkView = document.getElementById('mark-view')

function debounc(fn, delay) {
    let time
    return () => {
        time && clearTimeout(time)
        let arg = arguments
        time = setTimeout(() => {
            fn(...arg)
        }, delay)
    }
}

function IMarks() { }

IMarks.prototype.init = function () {
    this.render().listenSearch().listenRemove()
}
IMarks.prototype.render = function () {
    this.getData((treeData) => {
        const arr = this.createNode(treeData)
        divMarkView.append(arr)
    })
    return this
}
IMarks.prototype.createNode = function (array) {
    const self = this
    const _div = document.createElement('div')
    _div.setAttribute('class', 'folder-wrapper')
    array.forEach(item => {
        if (item.children && item.children.length > 0) {
            const div = this.createFolderSelf(item)
            _div.appendChild(div)
        } else {
            const div = this.createFolderItem(item)
            _div.appendChild(div)
        }
    })
    return _div
}

IMarks.prototype.getData = function (cb) {
    chrome.bookmarks.getTree(
        (tree) => {
            let treeData = tree[0]?.children
            cb(treeData)
        }
    )
}
IMarks.prototype.deleteMark = function (id) {
    chrome.bookmarks.remove(id, (res) => {
        // this.update()
    })
}

IMarks.prototype.update = function () {
    divMarkView.innerHTML = ''
    this.render()
}
IMarks.prototype.debounc = function (fn, delay) {
    let time
    return function () {
        time && clearTimeout(time)
        time = setTimeout(() => {
            fn()
        }, delay)
    }
}

IMarks.prototype.createFolderSelf = function (item) {
    const div = document.createElement('div')
    const divTitle = document.createElement('div')
    const img = document.createElement('img')
    const span = document.createElement('span')
    span.innerHTML = item.title
    img.setAttribute('src', './images/folder-dark.png')
    img.setAttribute('class', 'folder-icon')
    divTitle.setAttribute('class', 'folder-title')
    divTitle.appendChild(img)
    divTitle.appendChild(span)
    div.appendChild(divTitle)
    div.appendChild(this.createNode(item.children))
    return div
}
IMarks.prototype.createFolderItem = function (item) {
    const div = document.createElement('div')
    div.setAttribute('class', 'folder-item-wrapper')
    div.setAttribute('id', item.id)
    const deleteIcon = this.createDeleteIcon(item)
    const favicon = document.createElement('i')
    favicon.setAttribute('calss','url-icon')
    favicon.setAttribute('style', `background-image: url(chrome://favicon/${item.url})`)
    const span = this.createFolderItemSpan(item)
    div.appendChild(favicon)
    div.appendChild(span)
    div.appendChild(deleteIcon)
    return div
}
IMarks.prototype.createDeleteIcon = function (item) {
    const deleteIcon = document.createElement('img')
    deleteIcon.setAttribute('class', 'delete-icon ')
    deleteIcon.setAttribute('id', item.id)
    deleteIcon.setAttribute('src', './images/delete-dark.png')
    deleteIcon.addEventListener('click', (e) => {
        const id = e.currentTarget.id
        this.deleteMark(id)
    })
    return deleteIcon
}
IMarks.prototype.createFolderItemSpan = function (item) {
    const span = document.createElement('span')
    span.setAttribute('class', 'folder-item')
    span.setAttribute('title', item.title)
    span.setAttribute('url', encodeURIComponent(item.url))
    span.innerHTML = item.title
    span.addEventListener('click', e => {
        const url = decodeURIComponent(e.currentTarget.getAttribute('url'))
        chrome.tabs.create({url});
    })
    return span
}
IMarks.prototype.listenRemove = function () {
    chrome.bookmarks.onRemoved.addListener((id) => {
        this.removeNode(id)
        //this.update()
    })
}

IMarks.prototype.removeNode = function (id) {
    const node = document.getElementById(id)
    node.remove()
}
IMarks.prototype.listenSearch = function () {
    document.getElementById('search-input').addEventListener('input', () => {
        this.search()
    })
    return this
}

IMarks.prototype.renderSearchRes = function (resArray) {
    if (!resArray || resArray.length === 0) return
    resArray.forEach(item => {
        const view = document.getElementById('request-view')
        const span = this.createFolderItemSpan(item)
        view.appendChild(span)
    })
}


IMarks.prototype.clearSearchResView = function () {
    const view = document.getElementById('request-view')
    view.innerHTML= ''
}
IMarks.prototype.search = function () {
    const s = () => {
        const value = document.querySelector('#search-input').value;
        chrome.bookmarks.search(value, (res) => {
            if(res.length === 0){ this.clearSearchResView() }
            this.renderSearchRes(res)
        })
    }
    this.time && clearTimeout(this.time)
    this.time = setTimeout(s, 1000)
}


const MyIMarks = new IMarks()
MyIMarks.init()


/*
document.querySelector('#submit').addEventListener('click',()=>{
    console.log('search');
    const value = document.querySelector('#search-input').value;
    chrome.bookmarks.search(value, (res) => {
        console.log(res);
    })
})
*/

