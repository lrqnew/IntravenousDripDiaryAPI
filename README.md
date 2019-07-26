# 点滴日记接口说明文档
## 一、用户模块 
### 1.1 用户注册
接口地址：/user/reg  
返回格式：json  
请求方式：post  
请求示例：http://127.0.0.1:8080/user/reg  
请求参数说明：  

| 名称    | 必填 |   类型 |   说明   |
|:---------|:-----:|:-------:|:--------:|
| email   |   是 | string |   邮箱   |
| userPwd |   是 | string | 用户密码 |

返回参数  

| 名称     |   类型 |   说明   |
|:---------|:-------:|:--------:|
| code |int |  返回码<br>200-注册成功<br>401-邮箱为空 <br>402-密码为空 |
| msg  | string | 返回说明 |
| userName  | string | 用户名 |
| email  | string | 邮箱 |
| token  | string | token值 |

Json返回示例
{ "code":"200", "msg":"reg success" }
### 1.2 用户登录
接口地址：/user/login  
返回格式：json  
请求方式：post  
请求示例：http://127.0.0.1:8080/user/login  
请求参数说明：  

| 名称    | 必填 |   类型 |   说明   |
|:---------|:-----:|:-------:|:--------:|
| email   |   是 | string |   邮箱   |
| userPwd |   是 | string | 用户密码 |

返回参数  

| 名称     |   类型 |   说明   |
|:---------|:-------:|:--------:|
| code |int |  返回码<br>200-注册成功<br>401-邮箱为空 <br>402-密码为空  |
| msg  | string | 返回说明 |

Json返回示例
{ "code":"200", "msg":"login success" }
### 1.3 查询邮箱是否已经存在
接口地址：/user/selectMail  
返回格式：json  
请求方式：get  
请求示例：http://127.0.0.1:8080/user/selectMail  
请求参数说明：  

| 名称    | 必填 |   类型 |   说明   |
|:---------|:-----:|:-------:|:--------:|
| email   |   是 | string |   邮箱   |

返回参数  

| 名称     |   类型 |   说明   |
|:---------|:-------:|:--------:|
| code |int |  返回码<br>200-邮箱不存在，可注册<br>401-邮箱为空 <br>402-邮箱已存在  |
| msg  | string | 返回说明 |

Json返回示例
{ "code":"200", "msg":"email not exists" }