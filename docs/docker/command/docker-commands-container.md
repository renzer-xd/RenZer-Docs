---
sidebar_position: 1
id: docker-commands-container
title: หมวดการจัดการ Container
sidebar_label: 1. หมวดการจัดการ Container
---

# หมวดการจัดการ Container (Container Management)
ใช้ควบคุม เจาะระบบ และดูสถานะของตู้ Container

-  ## ดู Container ที่กำลังรันอยู่
```bash
docker ps
```

-  ## ดู Container ทั้งหมดในเครื่อง (รวมตัวที่หยุดทำงานแล้ว)
```bash
docker ps -a
```

-  ## สั่งรัน Container ใหม่ขึ้นมาทำงาน
```bash
docker run -d --name <ชื่อคอนเทนเนอร์> -p <พอร์ตเครื่องหลัก>:<พอร์ตในคอนเทนเนอร์> <ชื่ออิมเมจ>
```
- -d (Detached): สั่งให้รันอยู่เบื้องหลัง (Background)
- --name: ตั้งชื่อให้คอนเทนเนอร์เพื่อเรียกใช้งานง่าย

-  ## สั่งหยุด / สั่งเริ่มทำงานอีกครั้ง / สั่งรีสตาร์ท
```bash
docker stop <ชื่อหรือID_คอนเทนเนอร์>
docker start <ชื่อหรือID_คอนเทนเนอร์>
docker restart <ชื่อหรือID_คอนเทนเนอร์>
```

-  ## มุดเข้าไปใน Terminal ของ Container (เข้าไปพ่นคำสั่งข้างใน)
```bash
docker exec -it <ชื่อหรือID_คอนเทนเนอร์> /bin/bash
# หาก bash ใช้ไม่ได้ ให้เปลี่ยนเป็น sh
docker exec -it <ชื่อหรือID_คอนเทนเนอร์> sh
```

-  ## ลบ Container (ต้อง Stop ก่อนจึงจะลบได้)
```bash
docker rm <ชื่อหรือID_คอนเทนเนอร์>
# บังคับลบทันทีโดยไม่สนสถานะ
docker rm -f <ชื่อหรือID_คอนเทนเนอร์>
```


