# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## 服务

### fileserver (小牛网盘)
- 路径: `/home/ubuntu/.openclaw/workspace/file-server`
- 端口: 3000
- 管理: PM2 (`pm2 restart file-server`)

### xiaoniu-music (小牛音乐)
- 路径: `/home/ubuntu/.openclaw/workspace/xiaoniu-music`
- 端口: 3001
- 管理: PM2 (`pm2 restart xiaoniu-music`)

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
