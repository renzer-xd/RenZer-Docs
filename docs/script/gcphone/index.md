---
# id: head-intro
sidebar_position: 2
# sidebar_label: GCPhone
slug: /script/gcphone/intro
# title: Head Metadata
---

# MongoDB Gcphone
ระบบ Gcphone ที่มีการปรับปรุงในการบันทึกและการเรียกใช้งานของ twitter โดยเปลี่ยนการบันทึกข้อมูล ไปใช้งาน MongoDB เพื่อความไวของการดึงข้อมูลมาใช้งาน

## ความต้องการ
- **[MongoDB Server](https://www.mongodb.com/try/download/community)**
- **[FiveM MongoDB Wrapper](https://github.com/renzer-xd/fivem-mongodb)**


## ติดตั้งและใช้งาน
1. ดาวน์โหลดและแตกไฟล์ `MongoDB-Gcphone`
2. สร้างชื่อ Collection `twitter_accounts` | `twitter_likes` | `twitter_tweets` ใน Mongodb Compass
3. นำไฟล์ `mongodb.lua` และ `twitter_SequenceValue.json` ไปใส่ในโฟลเดอร์ `gcphone/server` ของเซิฟเวอร์คุณ
4. เพิ่ม `@mongodb/lib/MongoDB.lua` และ `server/mongodb.lua` ลงใน fxmanifest.lua ของ gcphone ดังตัวอย่าง
```lua
server_script {
	'@es_extended/locale.lua',
	'@mysql-async/lib/MySQL.lua',
	'@mongodb/lib/MongoDB.lua',
	'server/mongodb.lua',
        ......
}
```

## เชื่อมต่อ Function
1. ไฟล์ server.lua ค้นหา function `getUserTwitterAccount` จากนั้นแทนที่ด้วยโค้ดดังต่อไปนี้
```lua
function getUserTwitterAccount(source, _identifier)
    local _source = source
    local identifier = _identifier
    local xPlayer = ESX.GetPlayerFromId(_source)
   
    MySQL.Async.fetchAll("SELECT firstname , lastname FROM users WHERE identifier = @identifier", {
        ['@identifier'] = identifier
    }, function(result2)
        local user = result2[1]
        if user and user['firstname'] and user['lastname'] then
            local FirstLastName = user['firstname'] .. ' ' .. user['lastname']
            TriggerClientEvent('crew:getPlayerBank', _source, xPlayer, FirstLastName)
            getUser(identifier,function(result)
                if result then
                    twitter_login(_source,result)
                else
                    DB:InsertTwitAccount(identifier,FirstLastName)
                end
            end)
        end
    end)
end
```
2.ไฟล์ twitter.lua ค้นหา RegisterServerEvent `gcPhone:twitter_login` จากนั้นให้ลบหรือปิดแล้วแทนที่ด้วยโค้ดดังต่อไปนี้
```lua
twitter_login = function(source, DataUser)
    local sourcePlayer = tonumber(source)
    TriggerClientEvent('gcPhone:twitter_setAccount', sourcePlayer, DataUser.username, DataUser.avatarUrl or nil)
end
```
3. ไฟล์ twitter.lua ค้นหา function `TwitterPostTweet` จากนั้นแทนที่ด้วยโค้ดดังต่อไปนี้
```lua
function TwitterPostTweet(a, b, c, d, e)
    getUser(d, function(User)
        DB:InsertPostTweet(User.id,a,b,d,function(status)
            if status then
                local tweet = {}
                tweet["authorId"] = tonumber(User.id);
                tweet["message"] = a;
                tweet["image"] = b;
                tweet["time"] = os.date();
                tweet["author"] = User.username;
                tweet["authorIcon"] = User.avatarUrl;

                TriggerClientEvent('gcPhone:twitter_newTweets',-1,tweet)
            end
        end)
    end)
end
```
4. ไฟล์ twitter.lua ค้นหา function `TwitterGetTweets` จากนั้นแทนที่ด้วยโค้ดดังต่อไปนี้
```lua
function TwitterGetTweets(cb) 
    local tweets = {}
    DB:GetPostTweet(nil,10,function(result)
        cb(result)
    end)
end
```
5. ไฟล์ twitter.lua ค้นหา function `TwitterGetFavotireTweets` จากนั้นแทนที่ด้วยโค้ดดังต่อไปนี้
```lua
function TwitterGetFavotireTweets(identifier, cb)
    DB:GetPostTweet(identifier,10,function(result)
        cb(result)
    end)
end
```
6. ไฟล์ twitter.lua ค้นหา function `getUser` จากนั้นแทนที่ด้วยโค้ดดังต่อไปนี้
```lua
function getUser(identifier, cb)
    DB:GetTwitAccounts(identifier,function(result)
        cb(result[1])
    end)
end

```
7. ไฟล์ twitter.lua ค้นหา function `TwitterToogleLike` จากนั้นแทนที่ด้วยโค้ดดังต่อไปนี้
```lua
function TwitterToogleLike(identifier, tweetId, sourcePlayer)
    getUser(identifier, function(user)
        DB:FindLikeTweet(tweetId,user,function(result)
            if result.status == true then
                TriggerClientEvent('gcPhone:twitter_updateTweetLikes', -1, result.id, result.likes + 1)
                TriggerClientEvent('gcPhone:twitter_setTweetLikes', sourcePlayer, result.id, true)
                TriggerEvent('gcPhone:twitter_updateTweetLikes', result.id, result.likes + 1)
            else
                TriggerClientEvent('gcPhone:twitter_updateTweetLikes', -1, result.id, result.likes - 1)
                TriggerClientEvent('gcPhone:twitter_setTweetLikes', sourcePlayer, result.id, false)
                TriggerEvent('gcPhone:twitter_updateTweetLikes', result.id, result.likes - 1)
            end
        end)
    end)
end

```
7. ไฟล์ twitter.lua ค้นหา function `TwitterToogleDelete` จากนั้นแทนที่ด้วยโค้ดดังต่อไปนี้
```lua
function TwitterToogleDelete(identifier, tweetId, sourcePlayer)
    DB:DeletePostTweet(tweetId,function(status)
        if status then
            TwitterGetFavotireTweets(identifier, function(tweets)
                TriggerClientEvent('gcPhone:twitter_getFavoriteTweets', sourcePlayer, tweets)
            end)
        end
    end)
end

```
8.ไฟล์ twitter.lua ค้นหา RegisterServerEvent `gcPhone:twitter_changeUsername` จากนั้นให้ลบหรือปิดแล้วแทนที่ด้วยโค้ดดังต่อไปนี้
```lua
RegisterServerEvent('gcPhone:twitter_changeUsername')
AddEventHandler('gcPhone:twitter_changeUsername', function(newUsername)
    local sourcePlayer = tonumber(source)
    local identifier = getPlayerID(source)
    getUser(identifier, function(user)
        DB:ChangeUsername(identifier,newUsername,function(status)
            if status then
                TriggerClientEvent('gcPhone:twitter_setAccount', sourcePlayer, newUsername, user.avatarUrl)
            end
        end)
    end)
end)
```
9.ไฟล์ twitter.lua ค้นหา RegisterServerEvent `gcPhone:twitter_setAvatarUrl` จากนั้นให้ลบหรือปิดแล้วแทนที่ด้วยโค้ดดังต่อไปนี้
```lua
RegisterServerEvent('gcPhone:twitter_setAvatarUrl')
AddEventHandler('gcPhone:twitter_setAvatarUrl', function(avatarUrl)
    local sourcePlayer = tonumber(source)
    local identifier = getPlayerID(source)
    getUser(identifier, function(user)
        DB:ChangeAvatar(identifier,avatarUrl,function(status)
            if status then
                TriggerClientEvent('gcPhone:twitter_setAccount', sourcePlayer, user.username, avatarUrl)
            end
        end)
    end)
end)
```
