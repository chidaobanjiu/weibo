import json
from routes.session import session
from utils import (
    log,
    redirect,
    http_response,
    json_response,
)
from models.todo import Todo
from models.weibo import Weibo
from models.weibo import Comment


def all_weibo(request):
    """
    返回所有 todo
    """
    ms = Weibo.all()
    # 要转换为 dict 格式才行
    data = [m.json() for m in ms]
    return json_response(data)


def add_weibo(request):
    form = request.json()
    m = Weibo.new(form)
    return json_response(m.json())


def delete_weibo(request):
    """
    通过下面这样的链接来删除一个 Weibo
    /delete?id=1
    """
    weibo_id = int(request.query.get('id'))
    w = Weibo.delete(weibo_id)
    log('删除微博', weibo_id)
    return json_response(w.json())


def update_weibo(request):
    form = request.json()
    weibo_id = int(form.get('id'))
    w = Weibo.update(weibo_id, form)
    return json_response(w.json())



# 本文件只返回 json 格式的数据
# 而不是 html 格式的数据
def all(request):
    """
    返回所有 todo
    """
    todo_list = Todo.all()
    # 要转换为 dict 格式才行
    todos = [t.json() for t in todo_list]
    return json_response(todos)


def add(request):
    """
    接受浏览器发过来的添加 todo 请求
    添加数据并返回给浏览器
    """
    # 得到浏览器发送的 json 格式数据
    # 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    form = request.json()
    # 创建一个 todo
    t = Todo.new(form)
    # 把创建好的 todo 返回给浏览器
    return json_response(t.json())


def delete(request):
    """
    通过下面这样的链接来删除一个 todo
    /delete?id=1
    """
    todo_id = int(request.query.get('id'))
    t = Todo.delete(todo_id)
    return json_response(t.json())


def update(request):
    form = request.json()
    todo_id = int(form.get('id'))
    t = Todo.update(todo_id, form)
    return json_response(t.json())


def add_comment(request):
    """
    接受浏览器发过来的添加 weibo 请求
    添加数据并返回给浏览器
    """
    log('add')
    form = request.json()
    # 创建一个 model
    c = Comment.new(form)
    # 把创建好的 model 返回给浏览器
    log('return comment:', c.json())
    log('***********', c)
    return json_response(c.json())


def delete_comment(request):
    """
    通过下面这样的链接来删除一个 comment
    /delete?id=1
    """
    comment_id = int(request.query.get('id'))
    w = Comment.delete(comment_id)
    return json_response(w.json())


route_dict = {
    '/api/todo/all': all,
    '/api/todo/add': add,
    '/api/todo/delete': delete,
    '/api/todo/update': update,
    # weibo api
    '/api/weibo/all': all_weibo,
    '/api/weibo/add': add_weibo,
    '/api/weibo/delete': delete_weibo,
    '/api/weibo/update': update_weibo,
    # comment api
    '/api/comment/add': add_comment,
    '/api/comment/delete': delete_comment,
}
