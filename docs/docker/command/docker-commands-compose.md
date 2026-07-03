---
sidebar_position: 6
id: docker-commands-compose
title: หมวดคำสั่ง Docker Compose
sidebar_label: 6. หมวดคำสั่ง Docker Compose
---

# หมวดคำสั่ง Docker Compose
ใช้ควบคุมกลุ่ม Container หลายๆ ตัวผ่านไฟล์ docker-compose.yml เพียงไฟล์เดียว (เหมาะมากกับระบบ monitoring หรือเซิร์ฟเวอร์เกม)

-  ## สั่งเปิดใช้งานทุกบริการที่ระบุในไฟล์ (Background)
```bash
docker compose up -d
```

-  ## สั่งให้ Build ใหม่และเปิดใช้งาน (ใช้เวลาแก้ไขค่าใน Dockerfile หรือคอนฟิก)
```bash
docker compose up -d --build
```

-  ## สั่งปิดและทำลายระบบ Container ทั้งหมดในโปรเจกต์นั้นทิ้ง
```bash
docker compose down
```

-  ## สั่งปิดระบบพร้อมกับลบ Volume ข้อมูลทั้งหมดทิ้งด้วย
```bash
docker compose down -v
```

-  ## ดูสถานะของ Container เฉพาะในกลุ่มคอมโพสนี้
```bash
docker compose ps
```

-  ## ดูสถานะของ Container เฉพาะในกลุ่มคอมโพสนี้
```bash
docker compose logs -f
```
