---
sidebar_position: 4
id: docker-commands-network
title: หมวดการจัดการระบบเครือข่าย
sidebar_label: 4. หมวดการจัดการระบบเครือข่าย
---

# หมวดการจัดการระบบเครือข่าย (Network Management)
ใช้เชื่อมตู้ Container แต่ละตัวเข้าหากัน หรือแยกวงแลนออกจากกัน

-  ## ดูวงเครือข่ายทั้งหมดใน Docker
```bash
docker network ls
```

-  ## สร้างวงเครือข่ายใหม่แบบ Bridge (วงแลนจำลองมาตรฐาน)
```bash
docker network create <ชื่อเครือข่าย>
```

-  ## เชื่อมต่อ หรือ ตัดการเชื่อมต่อ Container เข้ากับวงเครือข่าย
```bash
docker network connect <ชื่อเครือข่าย> <ชื่อคอนเทนเนอร์>
docker network disconnect <ชื่อเครือข่าย> <ชื่อคอนเทนเนอร์>
```