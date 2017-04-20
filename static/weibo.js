var timeString = function(timestamp) {
    t = new Date(timestamp * 1000)
    t = t.toLocaleTimeString()
    return t
}

var commentsTemplate = function(comments) {
    var html = ''
    for(var i = 0; i < comments.length; i++) {
        var c = comments[i]
        var id = c.id
        var t = `
            <div class='comment-cell' data-id=${id}>
                    <p>${c.content}<button class='comment-delete'>删除</button></p>
            </div>
        `
        html += t
    }
    return html
}

var WeiboTemplate = function(Weibo) {
    var content = Weibo.content
    var id = Weibo.id
    var weibo_id = 'Weibo-' + Weibo.id
    var comments = commentsTemplate(Weibo.comments)
    var t = `
        <div id=${weibo_id}  class='Weibo-cell' data-id=${id}>
            <div class="Weibo-content">
                [WEIBO]: ${content}
            </div>
            <button class="Weibo-edit">编辑</button>
            <button class="Weibo-delete">删除</button>
            <div class="comment-list">
                ${comments}
            </div>
            <div class="comment-form">
                <input type="hidden" name="weibo_id" value="">
                <input name="comment" class="comment-content">
                <br>
                <button class="comment-add">添加评论</button>
            </div>
        </div>
    `
    return t
    /*
    上面的写法在 python 中是这样的
    t = """
    <div class="Weibo-cell">
        <button class="Weibo-delete">删除</button>
        <span>{}</span>
    </div>
    """.format(Weibo)
    */
}

var insertWeibo = function(Weibo) {
    var WeiboCell = WeiboTemplate(Weibo)
    // 插入 Weibo-list
    var WeiboList = e('.weibo-list')
    WeiboList.insertAdjacentHTML('afterbegin', WeiboCell)
}

var insertEditForm = function(cell) {
    var form = `
        <div class='Weibo-edit-form'>
            <input class="Weibo-edit-input">
            <button class='Weibo-update'>更新</button>
        </div>
    `
    cell.insertAdjacentHTML('afterbegin', form)
}

var loadWeibos = function() {
    // 调用 ajax api 来载入数据
    apiWeiboAll(function(r) {
        // console.log('load all', r)
        // 解析为 数组
        var Weibos = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < Weibos.length; i++) {
            var Weibo = Weibos[i]
            insertWeibo(Weibo)
        }
    })
}

var bindEventWeiboAdd = function() {
    var b = e('#id-button-add-weibo')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-Weibo')
        var content = input.value
        log('click add', content)
        var form = {
            'content': content,
        }
        apiWeiboAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            var Weibo = JSON.parse(r)
            insertWeibo(Weibo)
        })
    })
}

var bindEventWeiboDelete = function() {
    var WeiboList = e('.weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    WeiboList.addEventListener('click', function(event){
        var self = event.target
        if(self.classList.contains('Weibo-delete')){
            // 删除这个 Weibo
            var WeiboCell = self.parentElement
            var Weibo_id = WeiboCell.dataset.id
            log('Weibo_id', Weibo_id)
            apiWeiboDelete(Weibo_id, function(r){
                log('删除成功', Weibo_id)
                WeiboCell.remove()
            })
        }
    })
}

var bindEventWeiboEdit = function() {
    var WeiboList = e('.weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    WeiboList.addEventListener('click', function(event){
        var self = event.target
        if(self.classList.contains('Weibo-edit')){
            // 弹出更新编辑框
            var WeiboCell = self.parentElement
            var content = e('.Weibo-content')
            content.remove()
            insertEditForm(WeiboCell)
        }
    })
}

var bindEventWeiboUpdate = function() {
    var WeiboList = e('.weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    WeiboList.addEventListener('click', function(event){
        var self = event.target
        if(self.classList.contains('Weibo-update')){
            log('点击了 update ')
            //
            var editForm = self.parentElement
            // querySelector 是 DOM 元素的方法
            // document.querySelector 中的 document 是所有元素的祖先元素
            var input = editForm.querySelector('.Weibo-edit-input')
            var title = input.value
            // 用 closest 方法可以找到最近的直系父节点
            var WeiboCell = self.closest('.Weibo-cell')
            var Weibo_id = WeiboCell.dataset.id
            var form = {
                'id': Weibo_id,
                'content': title,
            }
            apiWeiboUpdate(form, function(r){
                log('更新成功', Weibo_id)
                var Weibo = JSON.parse(r)
                var selector = '#Weibo-' + Weibo.id
                var WeiboCell = e(selector)
                var editForm = e('.Weibo-edit-form')
                editForm.remove()
                var content = `
                        <div class="Weibo-content">
                            [WEIBO]: ${Weibo.content}
                        </div>
                `
                WeiboCell.insertAdjacentHTML('afterbegin', content)


//                WeiboCell.remove()
            })
        }
    })
}


var insertComment = function(comment, cell) {
    // 插入 comment
    id = comment.id
    content = comment.content
    var comment = `
        <div class='comment-cell' data-id=${id}>
            <p>${content}<button class='comment-delete'>删除</button></p>
        </div>
    `
    cell.insertAdjacentHTML('beforeend', comment)
}

var bindEventCommentAdd = function() {
    var WeiboList = e('.weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    WeiboList.addEventListener('click', function(){
        var self = event.target
        log('self is', self)
        if (self.classList.contains('comment-add')) {
            var WeiboCell = self.parentElement.parentElement
            log('weibo is', WeiboCell)
            var commentList = WeiboCell.querySelector('.comment-list')
            var input = self.parentElement.querySelector('.comment-content')
            log('input', input)
            var content = input.value
            var Weibo_id = WeiboCell.dataset.id
            log('click add', content)
            log('weibo_id', Weibo_id)
            var form = {
            'content': content,
            'weibo_id': Weibo_id,
            }
        }
        apiCommentAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            var comment = JSON.parse(r)
            insertComment(comment, commentList)
        })
    })
}

var bindEventCommentDelete = function() {
    var WeiboList = e('.weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    WeiboList.addEventListener('click', function(event){
        var self = event.target
        if(self.classList.contains('comment-delete')){
            // 删除这个 Comment
            var WeiboCell = self.parentElement.parentElement.parentElement.parentElement
            var comment = self.parentElement.parentElement
            var comment_id = comment.dataset.id
            log('comment_id', comment_id)
            apiCommentDelete(comment_id, function(r){
                log('删除成功', comment_id)
                comment.remove()
            })
        }
    })
}


var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
    bindEventCommentAdd()
    bindEventCommentDelete()
}

var __main = function() {
    bindEvents()
    loadWeibos()
}

__main()
