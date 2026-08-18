---
title: 'Coding Agent 原理与差异：Claude Code、Codex、Hermes Agent、pi'
slug: coding-agent-principles-and-differences
locale: zh
translationKey: coding-agent-principles-and-differences
summary: 系统比较 Claude Code、OpenAI Codex、Hermes Agent 与 pi 的 Agent Loop、上下文、记忆、Compaction、工具、子代理、安全边界与扩展机制。
published: 2026-08-13
updated: 2026-08-18
draft: false
hideDate: true
tags: [Coding Agent, Memory, Agent Architecture, Claude Code, Codex]
series: Coding Agents
---

> 版本：2026-08-13
> 对象：Claude Code / OpenAI Codex / Nous Research Hermes Agent / pi
> 重点：Agent Loop、Context、Memory、Compaction、Tools、Subagent、MCP、联网、安全边界、模型耦合、扩展机制

<details class="article-toc">
<summary>目录 · 50 节</summary>
<div class="article-toc__groups">
<section>
<h3>Agent 与 Memory 基础</h3>
<ul>
<li><a href="#section-01">1. 先理解：Agent 并不等于大模型</a></li>
<li><a href="#section-02">2. Agent Loop：四家最底层其实非常相似</a></li>
<li><a href="#section-03">3. Memory：最容易被混淆的概念</a></li>
<li><a href="#section-04">4. 一个特别重要的区别</a></li>
</ul>
</section>
<section>
<h3>Claude Code</h3>
<ul>
<li><a href="#section-05">5. Claude Code</a></li>
<li><a href="#section-06">6. Claude Code Agent Loop</a></li>
<li><a href="#section-07">7. Claude Code 的 Memory</a></li>
<li><a href="#section-08">8. Claude Code 的 Session Memory</a></li>
<li><a href="#section-09">9. Claude Code Compaction</a></li>
<li><a href="#section-10">10. Claude Code Subagent</a></li>
<li><a href="#section-11">11. Claude Code Hooks</a></li>
<li><a href="#section-12">12. Claude Code 安全模型</a></li>
</ul>
</section>
<section>
<h3>Codex</h3>
<ul>
<li><a href="#section-13">13. Codex</a></li>
<li><a href="#section-14">14. Codex Agent Loop</a></li>
<li><a href="#section-15">15. Codex 的 AGENTS.md</a></li>
<li><a href="#section-16">16. Codex Memory：2026 年的重要变化</a></li>
<li><a href="#section-17">17. Codex Compaction</a></li>
<li><a href="#section-18">18. Codex Subagents</a></li>
<li><a href="#section-19">19. Codex Sandbox</a></li>
<li><a href="#section-20">20. Codex 的 Web Search 与 Shell Network 要分开</a></li>
<li><a href="#section-21">21. Codex 是否只能使用 OpenAI 模型？</a></li>
</ul>
</section>
<section>
<h3>Hermes Agent</h3>
<ul>
<li><a href="#section-22">22. Hermes Agent</a></li>
<li><a href="#section-23">23. Hermes Agent Loop</a></li>
<li><a href="#section-24">24. Hermes 的 Memory：四者中层次最显式</a></li>
<li><a href="#section-25">25. Hermes Session Search：真正的 Episodic Retrieval</a></li>
<li><a href="#section-26">26. Hermes Memory Architecture</a></li>
<li><a href="#section-27">27. Hermes 的 Skills 更接近 Learning</a></li>
<li><a href="#section-28">28. Hermes Compaction</a></li>
<li><a href="#section-29">29. Hermes Provider</a></li>
<li><a href="#section-30">30. Hermes 安全模型</a></li>
</ul>
</section>
<section>
<h3>pi 与四家横向比较</h3>
<ul>
<li><a href="#section-31">31. pi</a></li>
<li><a href="#section-32">32. pi Agent Loop</a></li>
<li><a href="#section-33">33. pi 默认 Tools</a></li>
<li><a href="#section-34">34. pi 的设计哲学</a></li>
<li><a href="#section-35">35. pi 的 Memory</a></li>
<li><a href="#section-36">36. pi Session Storage</a></li>
<li><a href="#section-37">37. pi Compaction</a></li>
<li><a href="#section-38">38. pi Extensions：核心能力几乎都可以重写</a></li>
<li><a href="#section-39">39. pi Skills、Prompt Templates 与 Packages</a></li>
<li><a href="#section-40">40. pi Provider 与模型耦合</a></li>
<li><a href="#section-41">41. pi 安全模型</a></li>
<li><a href="#section-42">42. MCP：四家的差异</a></li>
<li><a href="#section-43">43. 联网能力对比</a></li>
<li><a href="#section-44">44. 四家 Memory 总表</a></li>
<li><a href="#section-45">45. 四家 Agent Architecture 总表</a></li>
<li><a href="#section-46">46. 四者最核心的差异</a></li>
<li><a href="#section-47">47. 如果从 Memory 角度选</a></li>
<li><a href="#section-48">48. 如果从 Agent 研究角度看</a></li>
<li><a href="#section-49">49. 几个常见误区</a></li>
<li><a href="#section-50">50. 最终总结</a></li>
</ul>
</section>
</div>
</details>

---

<h2 id="section-01" data-article-section>1. 先理解：Agent 并不等于大模型</h2>

Claude Code、Codex、Hermes、pi 本质上都不是“一个模型”。

更准确地说：

**Agent = LLM + Agent Loop + Tools + Context Manager + Memory + Execution Environment + Permission/Sandbox + Orchestration**

可以抽象成：

<!-- prettier-ignore -->
```text
                    ┌──────────────────────┐
                    │      User Goal       │
                    └──────────┬───────────┘
                               ↓
              ┌────────────────────────────────┐
              │       Context Builder          │
              │                                │
              │ System Prompt                  │
              │ Project Instructions           │
              │ Session History                │
              │ Memory                         │
              │ Skills                         │
              │ Tool Definitions               │
              │ Repository / Environment Info  │
              └───────────────┬────────────────┘
                              ↓
                     ┌─────────────────┐
                     │       LLM       │
                     └───────┬─────────┘
                             │
                 ┌───────────┴───────────┐
                 ↓                       ↓
          Final Answer               Tool Call
                                         │
                                         ↓
                              Permission / Hooks
                                         │
                                         ↓
                            Sandbox / Execution
                                         │
                  ┌──────────┼──────────┐
                  ↓          ↓          ↓
              Filesystem   Shell      Web/MCP
                  │          │          │
                  └──────────┼──────────┘
                             ↓
                         Tool Result
                             │
                             └──────→ LLM
```

Claude Code 官方也明确将自己描述为 Claude 模型外部的 **agentic harness**：模型负责 reasoning，harness 提供工具、上下文管理和执行环境。Codex 官方对自己的描述也是类似的——Agent Loop 是连接用户、模型和工具的核心。pi 则甚至把 Agent Loop 单独做成了 `pi-agent` 层。 [Claude Code 工作原理文档](https://code.claude.com/docs/en/how-claude-code-works) [Codex CLI 文档](https://learn.chatgpt.com/docs/codex/cli) [pi Coding Agent 官方仓库](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)

所以：

> **模型决定“脑子怎么样”，Agent Harness 决定“这个脑子能看到什么、记住什么、能做什么，以及做错事时谁拦它”。**

这也是为什么同一个 Claude/GPT 模型放进不同 Agent 框架中，实际编码能力会明显不同。

---

<h2 id="section-02" data-article-section>2. Agent Loop：四家最底层其实非常相似</h2>

最基本的 ReAct / Tool-Calling Agent Loop 可以写成：

<!-- prettier-ignore -->
```python
messages = build_context()

while True:
    response = llm(messages, tools=tools)

    if response.has_tool_calls():
        results = execute_tools(response.tool_calls)
        messages += response
        messages += results
    else:
        return response
```

真实产品只是在这个 Loop 周围增加：

<!-- prettier-ignore -->
```text
context construction
memory retrieval
context compression
permission checking
sandbox
hooks
parallel tool calls
subagents
retry
checkpoint
telemetry
session persistence
```

因此真正区分 Agent 的，往往并不是“有没有 Agent Loop”，而是：

1. **Context 怎么组装**
1. **旧信息怎么保留**
1. **工具有哪些**
1. **工具执行在哪里**
1. **什么时候需要人类批准**
1. **上下文满了怎么办**
1. **能否调用其他 Agent**
1. **能否扩展新的工具和工作流**

---

<h2 id="section-03" data-article-section>3. Memory：最容易被混淆的概念</h2>

讨论 Agent Memory 时，不应该只问：

> “这个 Agent 有没有 Memory？”

应该进一步拆成至少六层。

### 3.1 Working Memory：工作记忆

就是当前 LLM 的 **Context Window**。

例如：

<!-- prettier-ignore -->
```text
System Prompt
+ 当前用户问题
+ 最近几十轮对话
+ 文件内容
+ Shell 输出
+ Tool Result
+ 当前任务状态
```

这些东西模型当前“看得见”。

但 Context Window 有大小限制，所以最终都会涉及：

**Compaction / Summarization / Context Pruning**

---

### 3.2 Episodic Memory：情景记忆

类似：

> “上周我们讨论过一次 Redis bug。”

本质上是过去发生过什么。

通常来源于：

<!-- prettier-ignore -->
```text
Session JSONL
SQLite conversation DB
Conversation transcript
```

但：

> **保存会话 ≠ Agent 能自动回忆会话。**

如果只是把 JSONL 放在硬盘上，而 Agent 没有检索工具，它实际上不会自动知道里面有什么。

---

### 3.3 Semantic Memory：语义/长期记忆

例如：

<!-- prettier-ignore -->
```text
这个项目统一使用 uv
用户喜欢 pytest
API tests 依赖 Redis
生产数据库禁止直接 migrate
```

这种不是完整历史，而是从过去经历中提炼出来的 **durable facts**。

Claude Code 的 Auto Memory、Codex Memories、Hermes MEMORY.md 都属于这一类。

---

### 3.4 Explicit Instruction Memory：显式规则记忆

例如：

<!-- prettier-ignore -->
```text
CLAUDE.md
AGENTS.md
.claude/rules/
.hermes.md
```

这是人主动告诉 Agent：

> “以后一直按照这个规则工作。”

它其实是一种非常稳定的长期记忆。

---

### 3.5 Procedural Memory：程序性记忆

比如：

> “如何部署这个服务？”

不是保存“部署过什么”，而是保存：

<!-- prettier-ignore -->
```text
1. build
2. test
3. docker build
4. push
5. deploy
6. smoke test
```

Agent 世界里：

**Skills 非常接近程序性记忆。**

Claude Code、Codex、Hermes、pi 目前都已经支持 Skills 或类似机制。Claude Code 和 Codex 的 Skills 都基于 Agent Skills 思路；pi 也支持 Skills，Hermes 更把 skill learning 做成了其长期学习体系的一部分。 [Claude Code 记忆文档](https://code.claude.com/docs/en/memory) [Codex 记忆文档](https://learn.chatgpt.com/codex/memories) [Hermes Agent Skills 文档](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md) [pi Skills 文档](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md)

---

### 3.6 External / Retrieval Memory

例如：

<!-- prettier-ignore -->
```text
GitHub
Notion
Linear
数据库
向量数据库
Google Drive
网页
内部知识库
```

它们不是塞进 Agent 本地 Memory，而是：

<!-- prettier-ignore -->
```text
Need information
      ↓
Search / MCP / Tool
      ↓
Retrieve only relevant information
      ↓
put into current context
```

这是未来大型 Agent 系统非常重要的模式。

---

<h2 id="section-04" data-article-section>4. 一个特别重要的区别</h2>

### Compaction ≠ Memory

例如一段 100K token 对话：

<!-- prettier-ignore -->
```text
Turn 1
Turn 2
...
Turn 300
```

Context 快满了。

Agent 做：

<!-- prettier-ignore -->
```text
Turn 1-250
     ↓
LLM Summary
     ↓
"用户正在重构支付模块，
已经修改了 A/B/C，
当前剩余问题是 X..."

+ Turn 251-300 原文
```

这是 **Compaction**。

它解决的是：

> 当前会话太长。

而 Memory 解决的是：

> 下一次新会话还要不要知道这件事？

两者完全不同。

---

<h2 id="section-05" data-article-section>5. Claude Code</h2>

### 5.1 产品定位

Claude Code 是比较典型的：

> **高度集成、Opinionated 的 Coding Agent Harness**

官方定义中，它能够：

- 读取代码
- 修改代码
- 执行命令
- 搜索文件
- 搜索 Web
- 使用 MCP
- 使用 Skills
- 调用 Subagents
- 使用 Hooks
- 管理 Sessions

而且 CLI、Desktop、IDE、Web 等界面底层共享相同的 agentic loop。 [Claude Code 功能总览](https://code.claude.com/docs/en/features-overview)

---

<h2 id="section-06" data-article-section>6. Claude Code Agent Loop</h2>

Claude Code 官方将执行过程描述为：

<!-- prettier-ignore -->
```text
Gather Context
      ↓
Take Action
      ↓
Verify
      ↓
Need more work?
      ↓
repeat
```

例如：

<!-- prettier-ignore -->
```text
用户：
"修复测试失败"

Claude：
run tests
   ↓
read error
   ↓
search source
   ↓
read files
   ↓
edit files
   ↓
run tests again
   ↓
verify
```

每次 Tool Result 都重新成为下一轮 LLM inference 的输入。 [Claude Code 工作原理文档](https://code.claude.com/docs/en/how-claude-code-works)

---

<h2 id="section-07" data-article-section>7. Claude Code 的 Memory</h2>

Claude Code 现在已经不能再简单描述成：

> “只有 CLAUDE.md。”

当前官方文档描述了明确的 **Auto Memory**。

### 第一层：CLAUDE.md

由用户编写：

<!-- prettier-ignore -->
```text
CLAUDE.md
.claude/CLAUDE.md
CLAUDE.local.md
~/.claude/CLAUDE.md
```

用于：

- 项目架构
- coding convention
- build/test 命令
- 工作流
- 长期规则

还支持：

<!-- prettier-ignore -->
```text
.claude/rules/
```

甚至可以：

<!-- prettier-ignore -->
```yaml
---
paths:
  - "src/api/**/*.ts"
---
```

只在操作相应文件时加载规则。

Claude Code 官方明确说明 CLAUDE.md 和 Auto Memory 都会在新会话中加载；CLAUDE.md 是用户写的规则，而 Auto Memory 是 Claude 自己学习出来的信息。 [Claude Code 记忆文档](https://code.claude.com/docs/en/memory)

一个有意思的细节：

> Claude Code **原生读取 CLAUDE.md，而不是 AGENTS.md**。

如果项目主要维护 `AGENTS.md`，官方建议在 CLAUDE.md 中：

<!-- prettier-ignore -->
```markdown
@AGENTS.md
```

把它 import 进来。 [Claude Code 记忆文档](https://code.claude.com/docs/en/memory)

---

### 第二层：Auto Memory

Claude 会自己决定：

> “这个东西未来可能还有价值，要不要记下来？”

例如：

<!-- prettier-ignore -->
```text
Build command
Debugging insight
Architecture note
Code style preference
Workflow habit
```

默认存储在：

<!-- prettier-ignore -->
```text
~/.claude/projects/<project>/memory/
```

典型结构：

<!-- prettier-ignore -->
```text
memory/
├── MEMORY.md
├── debugging.md
├── api-conventions.md
└── ...
```

其中：

<!-- prettier-ignore -->
```text
MEMORY.md
```

是索引。

每次新 session 默认加载：

**前 200 行或 25 KB，以先达到者为准。**

详细 topic 文件不会全部塞进 context，而是在需要时读取。Auto Memory 当前默认开启，并且同一个 Git repo 的多个 worktree 共享一套 repo memory。 [Claude Code 记忆文档](https://code.claude.com/docs/en/memory)

这是一个不错的设计：

<!-- prettier-ignore -->
```text
Always-loaded small index
           +
On-demand detailed memory
```

而不是：

<!-- prettier-ignore -->
```text
把所有历史全部塞进 prompt
```

---

<h2 id="section-08" data-article-section>8. Claude Code 的 Session Memory</h2>

每个 session 会保存为本地 JSONL：

<!-- prettier-ignore -->
```text
~/.claude/projects/<project>/<session-id>.jsonl
```

里面包括：

<!-- prettier-ignore -->
```text
message
tool call
tool result
metadata
```

因此支持：

<!-- prettier-ignore -->
```text
resume
continue
fork
branch
rewind
```

但一个全新的 session 默认仍然从 **新的 context window** 开始，并不会自动把旧 JSONL 全部装进 prompt；真正用于跨 session 学习的是 CLAUDE.md 和 Auto Memory。 [Claude Code 记忆文档](https://code.claude.com/docs/en/memory) [Claude Code 上下文窗口文档](https://code.claude.com/docs/en/context-window)

因此：

<!-- prettier-ignore -->
```text
JSONL = episodic storage

Auto Memory =
selected durable knowledge
```

---

<h2 id="section-09" data-article-section>9. Claude Code Compaction</h2>

Context 满了之后 Claude Code 会自动管理上下文。

高层逻辑大致是：

<!-- prettier-ignore -->
```text
context getting full
       ↓
discard / reduce older tool outputs
       ↓
summarize older conversation
       ↓
retain important/current information
       ↓
continue
```

Auto-compaction 默认开启，并且可以配置触发窗口。项目根部的 CLAUDE.md 在 compaction 后会重新注入；path-scoped / nested 规则则会在后续相关文件重新被访问时加载。 [Claude Code 上下文窗口文档](https://code.claude.com/docs/en/context-window) [Claude Code 记忆文档](https://code.claude.com/docs/en/memory)

所以 Claude Code 明确区分：

<!-- prettier-ignore -->
```text
Conversation instruction
      ↓
可能被 compact 丢失

CLAUDE.md
      ↓
persistent

Auto Memory
      ↓
persistent
```

---

<h2 id="section-10" data-article-section>10. Claude Code Subagent</h2>

Claude Code 的 Subagent 是：

<!-- prettier-ignore -->
```text
Main Agent
    │
    ├──── Research Agent
    │        own context
    │
    ├──── Test Agent
    │        own context
    │
    └──── Review Agent
             own context
```

每个 Subagent 可以有：

- 独立 Context Window
- 独立 System Prompt
- 独立 Tool Access
- 独立 Permissions
- 甚至自己的 Auto Memory

主要价值不是“多一个模型”这么简单，而是：

> **避免 Context Pollution。**

例如搜索产生 50K token 日志：

<!-- prettier-ignore -->
```text
Main Context
```

没必要把这些垃圾全部留下。

让 Subagent 搜完之后只返回：

<!-- prettier-ignore -->
```text
Finding A
Finding B
Finding C
```

会大幅提高主 Agent 上下文质量。 [Claude Code 子代理文档](https://code.claude.com/docs/en/sub-agents)

---

<h2 id="section-11" data-article-section>11. Claude Code Hooks</h2>

Hooks 是 Claude Code 一个非常重要的设计。

LLM instruction：

<!-- prettier-ignore -->
```text
"修改文件后记得运行 formatter"
```

存在概率性：

<!-- prettier-ignore -->
```text
LLM 可能记得
LLM 也可能忘
```

Hook：

<!-- prettier-ignore -->
```text
PostToolUse(Edit)
        ↓
run formatter
```

是确定性的。

因此：

<!-- prettier-ignore -->
```text
Prompt / CLAUDE.md
        =
soft behavioral constraint

Hook
        =
deterministic lifecycle logic
```

Hooks 可以运行 shell、HTTP、prompt 或 agent-based 检查，并挂在不同 lifecycle event 上。 [Claude Code Hooks 文档](https://code.claude.com/docs/en/hooks)

---

<h2 id="section-12" data-article-section>12. Claude Code 安全模型</h2>

Claude Code 主要使用两层：

<!-- prettier-ignore -->
```text
Permission
+
Sandbox
```

Permission 控制：

<!-- prettier-ignore -->
```text
Claude 能不能调用某个 Tool
能不能读取某路径
能不能 Edit
能不能 WebFetch 某 Domain
```

Sandbox 则在 OS 层约束 Bash：

<!-- prettier-ignore -->
```text
filesystem boundary
network boundary
```

两者是互补关系。 [Claude Code 安全文档](https://code.claude.com/docs/en/security)

---

<h2 id="section-13" data-article-section>13. Codex</h2>

Codex 更适合理解为：

> **OpenAI 的 Software Engineering Agent Harness**

核心设计非常强调：

<!-- prettier-ignore -->
```text
execution boundary
sandbox
approval
parallel agents
context engineering
```

---

<h2 id="section-14" data-article-section>14. Codex Agent Loop</h2>

Codex 官方专门公开了一篇《Unrolling the Codex agent loop》。

其核心仍然是：

<!-- prettier-ignore -->
```text
User
 ↓
construct context
 ↓
Responses API
 ↓
model
 ↓
tool call
 ↓
execute
 ↓
tool result
 ↓
model
```

但 Codex 会先组装相当丰富的 Context：

<!-- prettier-ignore -->
```text
base instructions
sandbox instructions
approval policy
AGENTS.md
project AGENTS.md
skills metadata
environment context
conversation
```

然后将：

<!-- prettier-ignore -->
```text
instructions
tools
input
```

发送给模型。 [Codex CLI 文档](https://learn.chatgpt.com/docs/codex/cli)；这篇 [Codex Agent Loop 工程文章](https://openai.com/index/unrolling-the-codex-agent-loop/) 也展示了同一套 context → Responses API → tool result 循环。

---

<h2 id="section-15" data-article-section>15. Codex 的 AGENTS.md</h2>

Codex 原生采用：

<!-- prettier-ignore -->
```text
AGENTS.md
```

而且是分层加载。

大致：

<!-- prettier-ignore -->
```text
~/.codex/AGENTS.md

repo/
├── AGENTS.md
│
└── backend/
    ├── AGENTS.md
    └── service/
```

Codex 从：

<!-- prettier-ignore -->
```text
project root
    ↓
current working directory
```

逐层读取。

还支持：

<!-- prettier-ignore -->
```text
AGENTS.override.md
```

越靠近当前工作目录的规则优先级越高。 [Codex AGENTS.md 文档](https://learn.chatgpt.com/docs/agent-configuration/agents-md)

因此 Claude Code 和 Codex 一个非常直观的区别就是：

<!-- prettier-ignore -->
```text
Claude Code → CLAUDE.md

Codex      → AGENTS.md
```

---

<h2 id="section-16" data-article-section>16. Codex Memory：2026 年的重要变化</h2>

以前很容易说：

> “Codex 没有真正的跨 session memory。”

现在已经不准确。

Codex 当前有：

**Local Memories**

开启之后，它可以从符合条件的过去 chats 中提取：

<!-- prettier-ignore -->
```text
useful context
durable facts
recent inputs
supporting evidence
```

写入：

<!-- prettier-ignore -->
```text
~/.codex/memories/
```

Codex 不会在每个 session 一结束就立即生成 memory，而是会等待 session idle，并跳过过短或仍然活跃的 session；生成内容还会进行 secret redaction。 [Codex 记忆文档](https://learn.chatgpt.com/codex/memories)

当前一个重要区别是：

> **Local Memories 默认关闭。**

需要开启 memory feature。

而且：

<!-- prettier-ignore -->
```text
/memories
```

可以控制：

<!-- prettier-ignore -->
```text
当前 chat 是否使用以前 memories
当前 chat 是否允许成为未来 memory source
```

所以 Codex 的长期 Memory pipeline 更像：

<!-- prettier-ignore -->
```text
Past Chat
    ↓
eligibility
    ↓
idle
    ↓
memory extraction
    ↓
redaction
    ↓
local memory store
    ↓
future context
```

---

<h2 id="section-17" data-article-section>17. Codex Compaction</h2>

Codex 这里有一个非常值得研究 Agent 架构的人注意的设计。

早期：

<!-- prettier-ignore -->
```text
conversation
    ↓
LLM summarize
    ↓
summary becomes new context
```

现在 Responses API 支持专门的：

<!-- prettier-ignore -->
```text
/responses/compact
```

返回 compacted input，其中包含特殊的 compaction item，包括 opaque encrypted state，用来帮助后续模型继续保留原上下文中的理解，同时释放 context window。Codex 达到自动 compaction threshold 后会自动使用这套机制。 [Codex Agent Loop 工程文章](https://openai.com/index/unrolling-the-codex-agent-loop/)

这与简单：

<!-- prettier-ignore -->
```text
"请总结上面的聊天"
```

已经不是完全一个层次的实现。

---

<h2 id="section-18" data-article-section>18. Codex Subagents</h2>

Codex 当前原生支持 Subagents。

<!-- prettier-ignore -->
```text
Main Codex Agent
      │
      ├── explore agent
      ├── tests agent
      ├── implementation agent
      └── reviewer agent
```

多个 Agent 可以并行执行相互独立的工作，然后主 Agent 汇总。

官方特别强调：

> Subagent 的一个主要价值就是把大量 exploration/log output 从主 context 中隔离出去。

当前 Codex 文档提供 subagent workflow。 [Codex 子代理文档](https://learn.chatgpt.com/docs/agent-configuration/subagents)

---

<h2 id="section-19" data-article-section>19. Codex Sandbox</h2>

这是 Codex 很核心的设计。

本地 Codex 使用：

**OS-enforced sandbox**

并将：

<!-- prettier-ignore -->
```text
Sandbox Policy
```

和：

<!-- prettier-ignore -->
```text
Approval Policy
```

分开。

典型模式包括：

<!-- prettier-ignore -->
```text
read-only

workspace-write

danger-full-access
```

Sandbox 决定：

> 技术上能不能执行。

Approval 决定：

> 什么情况下需要问用户。

Codex 默认还会限制 shell command 的网络访问；这里说的是本地 CLI/桌面环境由 sandbox 施加的命令边界。 [Codex 沙箱文档](https://learn.chatgpt.com/codex/sandboxing)

---

<h2 id="section-20" data-article-section>20. Codex 的 Web Search 与 Shell Network 要分开</h2>

这是一个很容易混淆的地方。

Codex 当前本地任务默认已经有：

<!-- prettier-ignore -->
```text
cached Web Search
```

也可以：

<!-- prettier-ignore -->
```bash
codex --search
```

切换到 live search。

但：

<!-- prettier-ignore -->
```text
Web Search Tool
```

和：

<!-- prettier-ignore -->
```text
shell command network access
```

不是一个权限。

所以完全可能出现：

<!-- prettier-ignore -->
```text
Codex 能 Web Search

但是

npm/curl/bash 暂时没有网络权限
```

这是有意的安全边界设计：本地 shell 是否能联网由 sandbox/approval 等边界决定，而 Codex cloud 的 agent internet access 是另一项按环境配置、默认关闭的能力。 [Codex 沙箱文档](https://learn.chatgpt.com/codex/sandboxing) [Codex cloud 网络访问文档](https://learn.chatgpt.com/codex/cloud/internet-access)

---

<h2 id="section-21" data-article-section>21. Codex 是否只能使用 OpenAI 模型？</h2>

现在也不能简单回答“是”。

默认当然高度 OpenAI-native：

<!-- prettier-ignore -->
```text
model_provider = openai
```

但是 Codex CLI 目前也支持：

<!-- prettier-ignore -->
```bash
codex --oss
```

配合：

<!-- prettier-ignore -->
```text
Ollama
LM Studio
```

而配置系统还支持自定义 provider / Responses-compatible endpoint。 [Codex CLI 文档](https://learn.chatgpt.com/docs/codex/cli) [Codex 官方仓库](https://github.com/openai/codex)

所以更准确的说法是：

> **Codex 是 OpenAI-native，但 harness 已经不再绝对等于 OpenAI-hosted-model-only。**

---

<h2 id="section-22" data-article-section>22. Hermes Agent</h2>

这里的 Hermes 指：

**Nous Research / Hermes Agent**

它和前两个最大的定位差异是：

Claude Code / Codex 首先是：

<!-- prettier-ignore -->
```text
Software Engineering Agent
```

Hermes 更接近：

<!-- prettier-ignore -->
```text
Personal General Agent
+
Coding Agent
+
Automation Agent
```

官方称其在 CLI、TUI、Electron Desktop、Telegram、Discord、Slack 等大量 messaging platform 上运行同一套 Agent Core，还支持 Browser、Terminal、Cron、Memory、Subagents。 [Hermes Agent 官方仓库](https://github.com/NousResearch/hermes-agent)

---

<h2 id="section-23" data-article-section>23. Hermes Agent Loop</h2>

Hermes 同样是经典 Loop：

<!-- prettier-ignore -->
```text
Prompt
 ↓
Build system/context
 ↓
LLM
 ↓
Tool Call?
 ├─ No → save session → final
 │
 └─ Yes
      ↓
    Tool Dispatcher
      ↓
    Tool Result
      ↓
      LLM
```

Hermes 内部有专门的 Agent-level tools，例如：

<!-- prettier-ignore -->
```text
todo
memory
session_search
delegate_task
```

以及一个中央 Tool Registry。

当前官方架构文档描述为 70+ tools、约 28 个 toolsets，并支持根据 tool mix 进行 sequential / concurrent execution。 [Hermes Agent 架构文档](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture)

---

<h2 id="section-24" data-article-section>24. Hermes 的 Memory：四者中层次最显式</h2>

Hermes 的 Memory 特别值得单独研究。

### 第一层：MEMORY.md

Agent 自己维护的长期事实：

<!-- prettier-ignore -->
```text
~/.hermes/memories/MEMORY.md
```

例如：

<!-- prettier-ignore -->
```text
project conventions
environment facts
things learned
important decisions
```

---

### 第二层：USER.md

专门记录用户模型：

<!-- prettier-ignore -->
```text
~/.hermes/memories/USER.md
```

例如：

<!-- prettier-ignore -->
```text
communication preference
user preference
workflow expectations
```

默认配置中两者都是 bounded memory：

<!-- prettier-ignore -->
```text
MEMORY.md      ≈ 2200 chars
USER.md        ≈ 1375 chars
```

设计目标不是无限存，而是逼 Agent：

<!-- prettier-ignore -->
```text
prune
merge
consolidate
replace stale information
```

官方将两者描述为每个 session 都注入 System Prompt 的 curated memory。 [Hermes Agent 记忆文档](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md)

---

<h2 id="section-25" data-article-section>25. Hermes Session Search：真正的 Episodic Retrieval</h2>

这也是 Hermes Memory 体系里比较有特色的一层。

所有 CLI / messaging sessions 会保存在：

<!-- prettier-ignore -->
```text
~/.hermes/state.db
```

SQLite 中，并创建：

<!-- prettier-ignore -->
```text
FTS5
```

全文索引。

Agent 可以主动调用：

<!-- prettier-ignore -->
```text
session_search(...)
```

去找几周前的对话。

当前专门的 Memory 文档说明，FTS5 search 可以返回数据库中的真实 messages，并支持沿 session 前后滚动。 [Hermes Agent 会话文档](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/sessions.md) [Hermes Agent 记忆文档](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md)

因此：

<!-- prettier-ignore -->
```text
MEMORY.md
    =
很小、很重要、永远进入 context

SQLite session DB
    =
很大、完整、按需搜索
```

这个设计非常类似人的：

<!-- prettier-ignore -->
```text
semantic memory
+
episodic memory
```

---

<h2 id="section-26" data-article-section>26. Hermes Memory Architecture</h2>

可以画成：

<!-- prettier-ignore -->
```text
                 Hermes Memory
                       │
      ┌────────────────┼────────────────┐
      ↓                ↓                ↓
 Semantic Memory   Episodic Memory  Procedural Memory
      │                │                │
 MEMORY.md          SQLite           Skills
 USER.md             FTS5
      │                │
 always loaded      on-demand
      │
      ↓
 System Prompt
```

此外 Hermes 还有：

<!-- prettier-ignore -->
```text
SOUL.md
```

管理 Agent persona / identity。

项目本身还可以使用：

<!-- prettier-ignore -->
```text
.hermes.md
HERMES.md
AGENTS.md
CLAUDE.md
.cursorrules
```

提供项目 context。部分上下文还能在 Agent 进入子目录后渐进式发现，而不是一开始把所有规则都塞进 context。 [Hermes Agent Context Files 文档](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)

---

<h2 id="section-27" data-article-section>27. Hermes 的 Skills 更接近 Learning</h2>

Hermes 的目标不仅是：

<!-- prettier-ignore -->
```text
store facts
```

还包括：

<!-- prettier-ignore -->
```text
learn procedure
```

因此其整体理念是：

<!-- prettier-ignore -->
```text
do task
   ↓
learn useful knowledge
   ↓
write memory

or

discover reusable procedure
   ↓
create / improve skill
```

官方将它称为一个：

**closed learning loop**

并明确强调 agent-curated memory、skill creation 和 skill improvement。 [Hermes Agent Skills 文档](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md)

这也是为什么 Hermes 更像：

> **长期运行的个人 Agent**

而不只是：

> “打开 repo，修一个 bug，然后退出。”

---

<h2 id="section-28" data-article-section>28. Hermes Compaction</h2>

Hermes 在 context 接近上限时会：

<!-- prettier-ignore -->
```text
flush memory first
       ↓
summarize middle conversation
       ↓
keep last N messages intact
       ↓
keep tool-call/result pairs together
       ↓
rewrite same-session message list
       ↓
archive compacted turns for search
```

默认 `compression.in_place: true` 会在同一个 session id 上重写 live message list；它仍会保护最近约 20 条消息，并形成：

<!-- prettier-ignore -->
```text
session A (stable id)
   ↓
in-place compaction
   ↓
session A (same id)
```

默认不会产生 `session A → A#2 → A#3` 的轮换 lineage；只有显式设置 `in_place: false` 才恢复旧的 rotation path，并通过 `parent_session_id` 连接前后 session。 [Hermes Agent 上下文压缩与缓存文档](https://hermes-agent.nousresearch.com/docs/developer-guide/context-compression-and-caching)

这个细节很重要：

> 在压缩之前先 flush durable memory，可以降低重要知识只存在于即将被压缩 context 中而丢失的概率。

---

<h2 id="section-29" data-article-section>29. Hermes Provider</h2>

Hermes 在四者中属于明显的：

**Provider-agnostic Agent Harness**

支持云模型以及本地/self-hosted endpoint，包括 OpenRouter、Anthropic、OpenAI 类接口以及 Ollama、vLLM 等方案，并提供 provider fallback。 [Hermes Agent 官方仓库](https://github.com/NousResearch/hermes-agent)

因此：

<!-- prettier-ignore -->
```text
Hermes
   │
   ├── Claude
   ├── GPT
   ├── Gemini
   ├── Hermes model
   ├── OpenRouter models
   └── local models
```

Agent Harness 与模型的耦合相对较低。

---

<h2 id="section-30" data-article-section>30. Hermes 安全模型</h2>

Hermes 的特点是执行环境非常灵活：

<!-- prettier-ignore -->
```text
local
docker
ssh
singularity
modal
daytona
vercel sandbox
```

危险命令审批目前支持类似：

<!-- prettier-ignore -->
```text
smart
manual
off
```

其中 smart 可以先让辅助模型进行风险判断；真正隔离则可以使用 Docker 等 terminal backend。 [Hermes Agent 安全文档](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md)

因此 Hermes 的安全理念更接近：

> **Execution Backend 可配置。**

不像 Codex 那样把 sandbox boundary 作为产品核心默认设计之一。

---

<h2 id="section-31" data-article-section>31. pi</h2>

这里的 pi 是当前：

<!-- prettier-ignore -->
```text
earendil-works/pi
```

原来的 Mario Zechner / badlogic `pi-mono` 项目演进而来。

它的哲学和前面三个非常不一样。

官方直接说：

> **Pi keeps the core small.**

也就是：

**Minimal Agent Harness**

---

<h2 id="section-32" data-article-section>32. pi Agent Loop</h2>

pi 甚至把底层 agent loop 做成独立 package。

大致：

<!-- prettier-ignore -->
```text
prompt
 ↓
agent_start
 ↓
turn_start
 ↓
LLM streaming
 ↓
tool call
 ↓
execute tool
 ↓
tool result
 ↓
turn_end
 ↓
another turn
 ↓
...
 ↓
agent_end
```

当前底层 Agent Core 还支持多 tool call 默认 parallel execution，并提供 `beforeToolCall`、`afterToolCall` 等 hook 点。 [pi Coding Agent 官方仓库](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)

因此从“学习 Agent 实现”这个角度：

> pi 是四者中非常适合直接阅读源码理解 Agent Loop 的项目。

---

<h2 id="section-33" data-article-section>33. pi 默认 Tools</h2>

pi 默认只给模型四个核心工具：

<!-- prettier-ignore -->
```text
read
write
edit
bash
```

另外有：

<!-- prettier-ignore -->
```text
grep
find
ls
```

等内置只读工具可选择启用。 [pi Coding Agent 官方仓库](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)

对比 Hermes 的几十种 Toolsets：

<!-- prettier-ignore -->
```text
pi
→ 小核心

Hermes
→ 大型 general-agent tool environment
```

---

<h2 id="section-34" data-article-section>34. pi 的设计哲学</h2>

pi 官方明确表示，核心**故意不内置**：

<!-- prettier-ignore -->
```text
MCP
sub-agents
permission popups
plan mode
todos
background bash
```

这些东西应该通过：

<!-- prettier-ignore -->
```text
Extensions
Skills
Prompt Templates
Packages
external tools
```

实现。 [pi Coding Agent 官方仓库](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)

所以 pi 不是：

> “功能做不到。”

而是：

> **作者不希望核心替你决定 Agent 应该长什么样。**

---

<h2 id="section-35" data-article-section>35. pi 的 Memory</h2>

pi Core 当前没有文档化的、类似：

<!-- prettier-ignore -->
```text
Claude Auto Memory

Codex Memories

Hermes MEMORY.md
```

这样的自动 learned semantic-memory subsystem。

这是理解 pi 的关键。

它主要有下面几层。

---

### 第一层：AGENTS.md / CLAUDE.md

pi 会加载：

<!-- prettier-ignore -->
```text
~/.pi/agent/AGENTS.md
```

以及从 parent directory 到当前目录的：

<!-- prettier-ignore -->
```text
AGENTS.md
or
CLAUDE.md
```

用于项目 instruction；这些 context-file 加载行为应以 [pi Coding Agent 官方仓库](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent) 当前实现为准，而不是 Skills 文档。

因此：

<!-- prettier-ignore -->
```text
Explicit persistent memory
✓
```

---

<h2 id="section-36" data-article-section>36. pi Session Storage</h2>

pi 会把会话保存为树状 JSONL：

<!-- prettier-ignore -->
```text
~/.pi/agent/sessions/
```

树中的每个 entry 都有自己的 ID，并通过 parent ID 形成分支。因此它不只是线性 transcript，而更像：

<!-- prettier-ignore -->
```text
root
 ├── turn A
 │    ├── turn B
 │    │    └── turn C
 │    └── alternate B
 └── alternate A
```

这使 pi 可以在已有节点上继续、回到较早位置产生新分支，也可以恢复已有 session。Session 解决的是“把过去保存下来”，但它本身仍不等于自动长期记忆：新 session 是否知道旧 session，取决于显式加载、扩展或检索机制。 [pi Sessions 文档](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/sessions.md)

---

<h2 id="section-37" data-article-section>37. pi Compaction</h2>

pi 支持自动和手动 compaction。它的基本思路仍然是：

<!-- prettier-ignore -->
```text
old conversation
      ↓
summarize old branch
      ↓
keep recent messages
      ↓
continue from compacted state
```

但 pi 的 session tree 不需要被原地覆盖。Compaction 可以作为新的 entry 写入树中，并保留原始历史，因此后续仍有机会回到 compaction 前的节点。

pi 还允许 extension 介入 compaction 生命周期，自定义：

- 什么时候 compact
- summary prompt
- 哪些消息保留
- 如何把额外状态写回 session

所以 pi 的特点不是提供最复杂的默认记忆，而是把 context management 暴露为可编程接口。 [pi Compaction 文档](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/compaction.md)

---

<h2 id="section-38" data-article-section>38. pi Extensions：核心能力几乎都可以重写</h2>

pi 的 Extension API 可以监听 agent 和 session lifecycle，例如：

<!-- prettier-ignore -->
```text
session_start
session_switch
before_agent_start
agent_start
turn_start
tool_call
tool_result
turn_end
agent_end
before_compact
session_compact
```

Extension 还可以：

- 注册新工具
- 包装或阻止工具调用
- 添加命令
- 改写 system prompt
- 注入 context
- 保存自定义 session state
- 创建 UI
- 实现 approval
- 实现 subagent
- 接入 MCP
- 实现长期 memory

因此 pi 更接近一个：

> **可编程 Agent Runtime / Agent SDK**

而 Claude Code、Codex 更接近已经替用户做出大量产品决策的完成品。 [pi Extensions 文档](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)

---

<h2 id="section-39" data-article-section>39. pi Skills、Prompt Templates 与 Packages</h2>

pi 的复用能力主要分成三层：

<!-- prettier-ignore -->
```text
Prompt Template
    = reusable prompt

Skill
    = reusable procedure + instructions + resources

Package
    = distributable bundle
      (extensions / skills / prompts / themes)
```

Skills 可以按需发现和加载，避免每次都把所有操作手册塞进 context。Package 则让一组扩展、skills、prompt templates 和主题一起安装与分享。

所以 pi 的“程序性记忆”很强，但它更多是由人或 extension 明确构建，而不是核心自动从每次工作中提炼。 [pi Skills 文档](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md)

---

<h2 id="section-40" data-article-section>40. pi Provider 与模型耦合</h2>

pi 是明显的 multi-provider harness。它把模型接入、agent loop 和 coding UI 拆成多个 package，可连接多家 API 与兼容 endpoint。

可以概括为：

<!-- prettier-ignore -->
```text
pi-ai
  ↓
provider abstraction
  ↓
Anthropic / OpenAI / Google / OpenRouter /
compatible APIs / local or custom endpoints
```

它对模型供应商的耦合显著低于 Claude Code，也低于默认配置下的 Codex。 [pi Providers 文档](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/providers.md)

---

<h2 id="section-41" data-article-section>41. pi 安全模型</h2>

pi 默认不提供 Claude Code / Codex 式的 permission popup 和强制 sandbox。

默认工具中的：

<!-- prettier-ignore -->
```text
bash
write
edit
```

可以直接改变系统状态，安全边界主要取决于：

- 运行 pi 的 OS 用户权限
- 容器 / VM / sandbox
- 用户安装的 extension
- 自定义 tool wrapper
- 外部执行环境

所以：

> **pi 的默认假设更接近“用户拥有并控制本机开发环境”。**

这种设计对高级用户非常自由，但开箱即用的防护弱于 Codex 和 Claude Code。若用于不可信 repo 或无人值守自动化，最好放进容器、VM 或其他隔离环境。 [pi 安全文档](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/security.md)

---

<h2 id="section-42" data-article-section>42. MCP：四家的差异</h2>

<div class="article-table-scroller" tabindex="0" role="region" aria-label="MCP 能力对比">
<table>
<thead><tr><th scope="col">Agent</th><th scope="col">MCP 状态</th><th scope="col">设计倾向</th></tr></thead><tbody><tr><td>Claude Code</td><td>原生支持</td><td>把 MCP 作为连接外部工具和数据的重要标准接口</td></tr><tr><td>Codex</td><td>原生支持</td><td>MCP server 作为工具层扩展，可配合 Skills 和 sandbox</td></tr><tr><td>Hermes</td><td>原生支持，并同时拥有大量内置 toolsets</td><td>MCP 是通用 Agent 工具生态的一部分</td></tr><tr><td>pi</td><td>核心故意不内置</td><td>通过 extension / package 或外部桥接实现</td></tr></tbody>
</table>
</div>

pi 不内置 MCP 并不意味着不能使用 MCP，而是强调： [Claude Code MCP 文档](https://code.claude.com/docs/en/mcp) [Codex MCP 文档](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) [MCP 官方入门文档](https://modelcontextprotocol.io/docs/getting-started/intro)

<!-- prettier-ignore -->
```text
MCP support
    should be optional
    and replaceable
```

---

<h2 id="section-43" data-article-section>43. 联网能力对比</h2>

<div class="article-table-scroller" tabindex="0" role="region" aria-label="联网能力对比">
<table>
<thead><tr><th scope="col">Agent</th><th scope="col">Web Search / Browser</th><th scope="col">Shell 网络</th><th scope="col">关键区别</th></tr></thead><tbody><tr><td>Claude Code</td><td>WebSearch、WebFetch、浏览器相关工具与 MCP</td><td>受 permission / sandbox / network policy 影响</td><td>Web 工具和 shell 网络是不同权限面</td></tr><tr><td>Codex</td><td>Web search</td><td>本地 shell 网络通常受 sandbox policy 限制</td><td>Search 可用不等于 curl/npm 可联网</td></tr><tr><td>Hermes</td><td>Web、browser、search、messaging 等工具较丰富</td><td>取决于 terminal backend 和配置</td><td>更偏 general agent</td></tr><tr><td>pi</td><td>默认核心没有专门 Web Search</td><td>bash 能否联网取决于运行环境</td><td>通常通过 extension、CLI 工具或 MCP 增加</td></tr></tbody>
</table>
</div>

因此判断“能否联网”至少要拆成： [Claude Code 安全文档](https://code.claude.com/docs/en/security) [Codex 沙箱文档](https://learn.chatgpt.com/codex/sandboxing) [Codex cloud 网络访问文档](https://learn.chatgpt.com/codex/cloud/internet-access) [Hermes Agent 安全文档](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md) [pi 安全文档](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/security.md)

<!-- prettier-ignore -->
```text
模型是否有 search tool
浏览器是否可用
shell 是否能访问网络
MCP server 是否可访问外部服务
是否需要批准
网络是否在 sandbox 中
```

---

<h2 id="section-44" data-article-section>44. 四家 Memory 总表</h2>

<div class="article-table-scroller" tabindex="0" role="region" aria-label="四家 Memory 总表">
<table>
<thead><tr><th scope="col">维度</th><th scope="col">Claude Code</th><th scope="col">Codex</th><th scope="col">Hermes Agent</th><th scope="col">pi</th></tr></thead><tbody><tr><td>Working Memory</td><td>当前 context window</td><td>当前 context window</td><td>当前 context window</td><td>当前 context window</td></tr><tr><td>项目规则</td><td>CLAUDE.md、.claude/rules</td><td>AGENTS.md、override</td><td>.hermes.md / HERMES.md / AGENTS.md 等</td><td>AGENTS.md / CLAUDE.md</td></tr><tr><td>自动语义记忆</td><td>Auto Memory，默认开启</td><td>Local Memories，默认关闭</td><td>Agent 主动维护 MEMORY.md / USER.md</td><td>核心无内置自动 learned memory</td></tr><tr><td>长期记忆位置</td><td>repo 对应 memory 目录</td><td>~/.codex/memories</td><td>~/.hermes/memories</td><td>由 extension / 用户文件决定</td></tr><tr><td>Session 存储</td><td>JSONL</td><td>本地 chat/session state</td><td>SQLite</td><td>树状 JSONL</td></tr><tr><td>Episodic Retrieval</td><td>resume / history；长期回忆主要靠 memory</td><td>thread/history + memories</td><td>FTS5 session_search</td><td>session tree / extension</td></tr><tr><td>Compaction</td><td>自动摘要与 context 管理</td><td>Responses compaction</td><td>in-place summary + stable session id + archived searchable turns; rotation only with in_place:false</td><td>tree-aware compaction，可扩展</td></tr><tr><td>Procedural Memory</td><td>Skills</td><td>Skills</td><td>Skills + skill learning</td><td>Skills / packages</td></tr><tr><td>用户画像</td><td>可写入 memory / CLAUDE.md</td><td>可进入 memories</td><td>独立 USER.md</td><td>由 AGENTS.md 或 extension 实现</td></tr><tr><td>Memory 哲学</td><td>自动学习 + 小索引按需读取</td><td>从历史会话提取、可控启用</td><td>bounded curated memory + episodic search</td><td>小核心，把策略交给用户</td></tr></tbody>
 </table>
 </div>

表中的 Claude Code 记忆机制见 [Claude Code 记忆文档](https://code.claude.com/docs/en/memory)，Codex 见 [Codex 记忆文档](https://learn.chatgpt.com/codex/memories)，Hermes 见 [Hermes Agent 记忆文档](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md)，pi 的 session/树状历史见 [pi Sessions 文档](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/sessions.md)。Hermes 的默认 compaction 保持 stable session id；旧式 rotation 只在 `in_place:false` 时启用，详见 [Hermes Agent 上下文压缩与缓存文档](https://hermes-agent.nousresearch.com/docs/developer-guide/context-compression-and-caching)。

---

<h2 id="section-45" data-article-section>45. 四家 Agent Architecture 总表</h2>

<div class="article-table-scroller" tabindex="0" role="region" aria-label="四家 Agent Architecture 总表">
<table>
<thead><tr><th scope="col">维度</th><th scope="col">Claude Code</th><th scope="col">Codex</th><th scope="col">Hermes Agent</th><th scope="col">pi</th></tr></thead><tbody><tr><td>核心定位</td><td>集成式 Coding Agent</td><td>Software Engineering Agent</td><td>Personal General Agent</td><td>Minimal programmable agent</td></tr><tr><td>默认工具丰富度</td><td>高</td><td>高</td><td>很高</td><td>很低</td></tr><tr><td>默认工具</td><td>文件、shell、web、MCP 等</td><td>文件、shell、web、MCP 等</td><td>terminal、browser、memory、messaging、automation 等</td><td>read / write / edit / bash</td></tr><tr><td>Subagent</td><td>原生</td><td>原生</td><td>原生 delegate_task</td><td>核心不内置，可扩展</td></tr><tr><td>Hooks</td><td>原生生命周期 hooks</td><td>Skills / rules / tool orchestration 等</td><td>tool registry 与 Agent hooks</td><td>Extension lifecycle 非常开放</td></tr><tr><td>MCP</td><td>原生</td><td>原生</td><td>原生</td><td>扩展实现</td></tr><tr><td>模型耦合</td><td>Anthropic-native</td><td>OpenAI-native，也支持 OSS / 自定义 provider</td><td>provider-agnostic</td><td>provider-agnostic</td></tr><tr><td>默认 Sandbox</td><td>permission + sandbox</td><td>OS-enforced sandbox + approval</td><td>backend 可配置</td><td>无强制 sandbox</td></tr><tr><td>UI</td><td>CLI / IDE / Desktop / Web</td><td>CLI / IDE / Desktop / Cloud</td><td>CLI / TUI / Desktop / messaging</td><td>TUI / print / RPC / SDK</td></tr><tr><td>自动化倾向</td><td>工程工作流</td><td>工程任务、并行执行、云任务</td><td>cron、消息平台、长期运行</td><td>由 extension 自己搭</td></tr><tr><td>可定制哲学</td><td>配置丰富但产品 opinionated</td><td>强执行边界和工程编排</td><td>大而全的 personal agent</td><td>极小核心、最大可编程性</td></tr></tbody>
 </table>
 </div>

表中的产品定位与默认工具边界分别依据 [Claude Code 功能总览](https://code.claude.com/docs/en/features-overview)、[Codex CLI 文档](https://learn.chatgpt.com/docs/codex/cli)、[Hermes Agent 架构文档](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture) 与 [pi Coding Agent 官方仓库](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)。

---

<h2 id="section-46" data-article-section>46. 四者最核心的差异</h2>

### Claude Code

核心优势：集成式 coding workflow、Auto Memory、Rules、Hooks、Subagents 与 MCP。 [Claude Code 功能总览](https://code.claude.com/docs/en/features-overview)

<!-- prettier-ignore -->
```text
强模型耦合
+ 成熟 coding workflow
+ Auto Memory
+ CLAUDE.md / Rules
+ Hooks
+ Subagents
+ MCP
```

适合：

> 希望开箱即用，且主要使用 Claude 完成软件工程任务的人。

---

### Codex

核心优势：sandbox / approval boundary、工程执行与并行编排。 [Codex CLI 文档](https://learn.chatgpt.com/docs/codex/cli)

<!-- prettier-ignore -->
```text
strong coding model
+ sandbox / approval boundary
+ AGENTS.md
+ Skills
+ compaction
+ parallel agents
+ local / cloud execution
```

适合：

> 重视工程执行、隔离、并行 Agent、长任务和可审查变更的人。

---

### Hermes

核心优势：长期个人记忆、消息平台、自动化与多种执行后端。 [Hermes Agent 官方仓库](https://github.com/NousResearch/hermes-agent)

<!-- prettier-ignore -->
```text
general agent
+ persistent personal memory
+ USER model
+ session search
+ messaging
+ browser
+ cron
+ many providers
+ many execution backends
```

适合：

> 想要一个长期运行、跨平台、跨任务的个人 Agent，而不只是 repo coding assistant 的人。

---

### pi

核心优势：小核心、透明 loop、session tree 与可编程扩展。 [pi Coding Agent 官方仓库](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)

<!-- prettier-ignore -->
```text
small core
+ readable agent loop
+ tree sessions
+ rich extension API
+ model/provider freedom
+ minimal product assumptions
```

适合：

> 想自己设计 Agent，而不是接受产品预设的人；也特别适合研究 agent loop 与 context engineering。

---

<h2 id="section-47" data-article-section>47. 如果从 Memory 角度选</h2>

### 想要开箱即用的自动项目记忆

优先看： [Claude Code 记忆文档](https://code.claude.com/docs/en/memory) [Codex 记忆文档](https://learn.chatgpt.com/codex/memories) [Hermes Agent 记忆文档](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md)

<!-- prettier-ignore -->
```text
Claude Code Auto Memory
```

它的优势是自动、项目级、默认启用，并使用小索引加按需 topic file。

### 想要可选择启用的本地历史提炼

优先看：

<!-- prettier-ignore -->
```text
Codex Local Memories
```

它更强调 eligibility、idle extraction、redaction 和 chat-level control。

### 想要真正显式的语义记忆 + 情景检索

优先看：

<!-- prettier-ignore -->
```text
Hermes
```

它把：

<!-- prettier-ignore -->
```text
MEMORY.md
USER.md
SQLite / FTS5
Skills
```

拆成清晰层级。

### 想自己实现 Memory

优先看：

<!-- prettier-ignore -->
```text
pi
```

它不会替你决定 memory policy，但 extension 和 session tree 提供了构建基础。

---

<h2 id="section-48" data-article-section>48. 如果从 Agent 研究角度看</h2>

建议阅读顺序： [Claude Code 工作原理文档](https://code.claude.com/docs/en/how-claude-code-works) [Codex CLI 文档](https://learn.chatgpt.com/docs/codex/cli) [Hermes Agent 官方仓库](https://github.com/NousResearch/hermes-agent) [pi Coding Agent 官方仓库](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)

<!-- prettier-ignore -->
```text
pi
 ↓
理解最小 agent loop / tool call / session / compaction

Codex
 ↓
理解 production sandbox / approval / context construction

Claude Code
 ↓
理解 mature coding harness / rules / hooks / auto memory

Hermes
 ↓
理解 general agent / personal memory / messaging / automation
```

原因是 pi 最容易看清“最小闭环”；另外三家更能展示真正产品化之后，为可靠性、安全、长期状态和多 Agent 编排增加了多少系统层。

---

<h2 id="section-49" data-article-section>49. 几个常见误区</h2>

### 误区 1：模型越强，Agent 一定越强

不一定。 [Claude Code 上下文窗口文档](https://code.claude.com/docs/en/context-window) [Codex CLI 文档](https://learn.chatgpt.com/docs/codex/cli) [Hermes Agent 会话文档](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/sessions.md) [pi Compaction 文档](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/compaction.md)

<!-- prettier-ignore -->
```text
Agent Quality
≈
Model Quality
× Context Quality
× Tool Quality
× Execution Reliability
× Verification Quality
```

工具输出污染、规则加载错误、sandbox 不匹配、compaction 丢信息，都可能让强模型表现很差。

### 误区 2：保存了 session 就等于有长期记忆

不等于。

<!-- prettier-ignore -->
```text
Storage
≠ Retrieval
≠ Selection
≠ Injection
```

真正的 Memory 系统至少要决定：

- 存什么
- 什么时候存
- 怎么检索
- 什么时候放回 context
- 如何删除过期信息
- 如何避免 secret 和错误事实长期存在

### 误区 3：Compaction 能无损保存历史

不能。

任何 summary 都会进行信息选择。更可靠的做法是：

<!-- prettier-ignore -->
```text
raw session storage
+ durable semantic memory
+ retrieval
+ compaction
```

四层共同工作，而不是只依赖 summary。

### 误区 4：Subagent 的价值只是并行

并行只是其中一个价值。另一个更关键的价值是：

> **Context isolation。**

把探索日志、搜索结果、失败尝试放在独立 context 中，只把结论返回主 Agent，通常能提高后续推理质量。

### 误区 5：MCP 越多越好

工具越多也意味着：

- tool schema 占用 context
- 选择工具更困难
- prompt injection 面增大
- 权限边界更复杂
- 错误和延迟更多

因此成熟系统会使用 tool filtering、skills、按需加载或 subagent 来减少主 context 的工具负担。

---

<h2 id="section-50" data-article-section>50. 最终总结</h2>

四家可以浓缩成四种不同的 Agent 哲学： [Claude Code 功能总览](https://code.claude.com/docs/en/features-overview) [Codex CLI 文档](https://learn.chatgpt.com/docs/codex/cli) [Hermes Agent 官方仓库](https://github.com/NousResearch/hermes-agent) [pi Coding Agent 官方仓库](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)

<!-- prettier-ignore -->
```text
Claude Code
=
成熟、集成、Claude-native 的 Coding Agent

Codex
=
强调 sandbox、工程执行与多 Agent 编排的
Software Engineering Agent

Hermes
=
强调长期记忆、用户模型、消息平台和自动化的
General Personal Agent

pi
=
强调小核心、透明 loop、session tree 与 extension 的
Programmable Agent Runtime
```

如果只记住 Memory 的区别，可以记成：

<!-- prettier-ignore -->
```text
Claude Code
→ Auto Memory

Codex
→ Extracted Local Memories

Hermes
→ Curated Memory + User Memory + Session Search

pi
→ No opinionated learned-memory core;
  build it with files, sessions and extensions
```

最终真正重要的不是某家 Agent 的功能列表，而是它如何回答下面几个问题：

<!-- prettier-ignore -->
```text
What enters context?
What survives compaction?
What survives a session?
What can be retrieved later?
What tools can act on the world?
Where do those tools run?
Who approves risky actions?
How can the system learn a reusable procedure?
```

这些问题共同决定了一个 Agent 的能力上限、可靠性、安全性和长期可用性。

## 参考资料

### Claude Code

- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
- [Features overview](https://code.claude.com/docs/en/features-overview)
- [Context window](https://code.claude.com/docs/en/context-window)
- [Memory](https://code.claude.com/docs/en/memory)
- [Sub-agents](https://code.claude.com/docs/en/sub-agents)
- [Hooks](https://code.claude.com/docs/en/hooks)
- [Security](https://code.claude.com/docs/en/security)
- [MCP](https://code.claude.com/docs/en/mcp)

### OpenAI Codex

- [Codex CLI](https://learn.chatgpt.com/docs/codex/cli)
- [Codex Agent Loop 工程文章](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Memory](https://learn.chatgpt.com/codex/memories)
- [Sub-agents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- [Sandboxing](https://learn.chatgpt.com/codex/sandboxing)
- [Codex cloud internet access](https://learn.chatgpt.com/codex/cloud/internet-access)
- [MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)
- [Official repository](https://github.com/openai/codex)

### Hermes Agent

- [Official repository](https://github.com/NousResearch/hermes-agent)
- [Architecture](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture)
- [Context compression and caching](https://hermes-agent.nousresearch.com/docs/developer-guide/context-compression-and-caching)
- [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)
- [Memory](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md)
- [Skills](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md)
- [Delegation](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/delegation.md)
- [Sessions](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/sessions.md)
- [Security](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md)

### pi

- [Official repository](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)
- [Compaction](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/compaction.md)
- [Extensions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)
- [Sessions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/sessions.md)
- [Skills](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md)
- [Providers](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/providers.md)
- [Security](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/security.md)

### MCP

- [MCP introduction](https://modelcontextprotocol.io/docs/getting-started/intro)
- [Official repository](https://github.com/modelcontextprotocol)
