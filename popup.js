console.log('pop.log');
const divMarkView = document.getElementById('mark-view')

function IMarks() { }
IMarks.prototype.render = function () {
    this.getData((treeData)=>{
        const arr = this.getNode(treeData)
        divMarkView.append(arr)
    })
}
IMarks.prototype.getNode = function (array) {
    const self = this
    const _div = document.createElement('div')
    _div.setAttribute('class', 'folder-wrapper')
    array.forEach(item => {
        if (item.children && item.children.length > 0) {
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
            div.appendChild(this.getNode(item.children))
            _div.appendChild(div)
        } else {
            const div = document.createElement('div')
            const img = document.createElement('img')
            const deleteIcon = document.createElement('img')
            deleteIcon.setAttribute('class', 'delete-icon ')
            deleteIcon.setAttribute('id', item.id)
            deleteIcon.setAttribute('src', './images/delete-dark.png')
            deleteIcon.addEventListener('click',function ( e){
                const id = e.currentTarget.id
                console.log(self.getNode);
                self.deleteMark(id)
            })
            //img.setAttribute('class', 'url-icon')
            //img.setAttribute('src', `chrome://favicon2/?size=16&scale_factor=1x&page_url=${encodeURIComponent(item.url)}&allow_google_server_fallback=0`)
            //img.setAttribute('style', `chrome://favicon/${encodeURIComponent(item.url)}`)
            //img.style = `background-image: -webkit-image-set(url("chrome://favicon2/?size=16&scale_factor=1x&page_url=${encodeURIComponent(item.url)}&allow_google_server_fallback=0") 1x, url("chrome://favicon2/?size=16&scale_factor=2x&page_url=${encodeURIComponent(item.url)}&allow_google_server_fallback=0") 2x)`
            div.setAttribute('class', 'folder-item-wrapper')
            const span = document.createElement('span')
            span.setAttribute('class', 'folder-item')
            span.setAttribute('title', item.title)
            span.setAttribute('url', encodeURIComponent(item.url))
            span.innerHTML = item.title
            span.addEventListener('click',e=>{
                const url = decodeURIComponent( e.currentTarget.getAttribute('url'))
                chrome.tabs.create({url});
            })
            //div.appendChild(img)
            div.appendChild(span)
            div.appendChild(deleteIcon)
            // span.setAttribute('href',item.url)
            _div.appendChild(div)
        }
    })
    return _div
}

IMarks.prototype.getData = function (cb) {
    chrome.bookmarks.getTree(
        (tree) => {
            let treeData = tree[0]?.children
            console.log(treeData);
            cb(treeData)
            //MyIMarks.render({treeData})
        }
    )
}
IMarks.prototype.deleteMark = function (id) {
    chrome.bookmarks.remove(id, (res) => {
       // this.update()
    })
}
IMarks.prototype.deleteDir = function () {
}
IMarks.prototype.update = function () {
    divMarkView.innerHTML = ''
    this.render()
}
IMarks.prototype.search = function () {
}


const MyIMarks = new IMarks()
MyIMarks.render()

chrome.bookmarks.onRemoved.addListener(
    ()=>{
        MyIMarks.update()
    }
)

