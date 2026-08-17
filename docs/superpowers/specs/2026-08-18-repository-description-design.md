# GitHub 仓库简介更新设计

## 目标

将 `ShaySha-PRa/ShaySha-PRa.github.io` 的 GitHub 仓库简介从过时的「基于hexo博客」更新为：

```text
基于 Astro 构建的个人网站
```

## 范围

- 只修改 GitHub 仓库的 `description` 元数据。
- 不修改网站正文、README、Topics、仓库主页地址、Pages 设置或项目代码。
- 不创建代码提交来承载仓库元数据；本设计文档仅记录已经确认的公开文案。

## 验收

- GitHub 仓库页面显示新的简介。
- GitHub API 返回的 `description` 与确认文案完全一致。
- 生产网站仍返回 HTTP 200。
