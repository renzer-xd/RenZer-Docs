---
sidebar_position: 5
id: docker-commands-cleanup
title: หมวดเคลียร์พื้นที่ (System Cleanup)
sidebar_label: 5. หมวดเคลียร์พื้นที่
---

# หมวดเคลียร์พื้นที่ (System Cleanup)
คำสั่งสลายร่างขยะเพื่อกู้พื้นที่ฮาร์ดดิสก์เซิร์ฟเวอร์กลับคืนมา

-  ## ลบ Container, Network และ Image ที่ตกค้างและไม่ได้รันอยู่ทิ้งทั้งหมด
```bash
docker system prune
```

-  ## ลบขยะทุกอย่างแบบถอนรากถอนโคน (รวมถึง Volume และ Image ที่ไม่มี Container เรียกใช้)
```bash
docker system prune -a --volumes -f
```
