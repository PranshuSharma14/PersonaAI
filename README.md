# 🤖 PersonaAI

> Create intelligent AI agents that understand context, remember conversations, and provide personalized responses through video meetings and real-time chat.

PersonaAI is a cutting-edge platform that enables users to build, customize, and interact with AI agents through immersive video meetings. Built with Next.js 15, React 19, and powered by OpenAI's latest models, it offers a seamless experience for creating domain-specific AI personalities.

## ✨ Features

### 🎯 **AI Agent Creation**
- **Custom Personalities**: Build specialized AI agents with unique expertise for any domain
- **Contextual Memory**: Agents remember previous interactions and maintain conversation continuity
- **Domain Expertise**: Create agents for music, fitness, technology, business, and more

### 📹 **Video Meetings**
- **Real-time Video Calls**: Have face-to-face conversations with your AI agents
- **Advanced Voice Technology**: Powered by Stream.io for high-quality audio/video
- **Meeting Recordings**: Automatic recording and storage of all interactions

### 🧠 **Smart Conversations**
- **GPT-5-nano Integration**: Lightning-fast responses with the latest OpenAI models
- **Context Awareness**: Agents understand conversation flow and maintain topic relevance
- **Ask AI Feature**: Interactive chat during meetings for instant clarification

### 📊 **Meeting Analytics**
- **Auto Summaries**: AI-generated meeting summaries with key insights and action items
- **Transcript Generation**: Complete conversation transcripts with timestamp accuracy
- **Usage Analytics**: Track conversation patterns and agent performance metrics

### 💎 **Premium Features**
- **Unlimited Agents**: Create as many AI personalities as needed
- **Advanced Capabilities**: Enhanced AI features and priority processing
- **Priority Support**: Dedicated support for premium subscribers

## 🚀 Tech Stack

### **Frontend**
- **Next.js 15** with App Router architecture
- **React 19** with latest features and optimizations
- **TypeScript** for type safety and better development experience
- **Tailwind CSS** for modern, responsive styling
- **Radix UI** components for accessible design system

### **Backend & Database**
- **PostgreSQL** for reliable data storage
- **Drizzle ORM** for type-safe database operations
- **tRPC** for end-to-end type safety between client and server

### **AI & Real-time**
- **OpenAI GPT-5-nano** for intelligent conversations
- **Stream.io** for video calls and real-time chat
- **Webhook Processing** for seamless meeting state management

### **Authentication & Payments**
- **Better Auth** for secure user authentication
- **Polar** integration for subscription management and payments

### **Background Processing**
- **Inngest** for async job processing
- **Webhook Handlers** for Stream.io event processing

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- OpenAI API key
- Stream.io account and API keys
- Polar account for payments (optional)

### Environment Variables
Create a `.env.local` file with the following:

```env
# Database
DATABASE_URL="postgresql://..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Stream.io
NEXT_PUBLIC_STREAM_KEY="your_stream_key"
STREAM_SECRET="your_stream_secret"

# Authentication
AUTH_SECRET="your_auth_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Polar (for payments)
POLAR_ACCESS_TOKEN="your_polar_token"

# Inngest
INNGEST_EVENT_KEY="your_inngest_key"
INNGEST_SIGNING_KEY="your_signing_key"
```

### Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/PranshuSharma14/PersonaAI.git
cd PersonaAI
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**
```bash
npm run db:generate
npm run db:migrate
```

4. **Start the application**
```bash
npm run dev
```

5. **Open the application**
Visit [http://localhost:3000](http://localhost:3000) to see PersonaAI in action.

## 📁 Project Structure

```
personaAI/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Main dashboard
│   │   ├── api/               # API routes
│   │   │   ├── webhook/       # Stream.io webhooks
│   │   │   ├── trpc/          # tRPC endpoints
│   │   │   └── inngest/       # Background jobs
│   │   └── call/              # Video call interface
│   ├── components/            # Reusable UI components
│   │   └── ui/                # Radix UI components
│   ├── modules/               # Feature modules
│   │   ├── agents/            # AI agent management
│   │   ├── meetings/          # Meeting functionality
│   │   ├── auth/              # Authentication
│   │   ├── dashboard/         # Dashboard UI
│   │   ├── premium/           # Subscription features
│   │   └── home/              # Landing page
│   ├── db/                    # Database schema & config
│   ├── lib/                   # Utility libraries
│   ├── trpc/                  # tRPC configuration
│   └── inngest/               # Background job functions
├── public/                    # Static assets
└── drizzle.config.ts          # Database configuration
```

## 🎯 Key Features Deep Dive

### Agent Creation Workflow
1. **Define Personality**: Set agent name, expertise area, and behavioral traits
2. **Configure Responses**: Customize how the agent communicates
3. **Test Interactions**: Preview agent responses before going live
4. **Deploy**: Make agent available for video meetings

### Meeting Flow
1. **Schedule/Start**: Create instant or scheduled meetings with agents
2. **Video Call**: Real-time video conversation powered by Stream.io
3. **AI Processing**: Live transcription and context understanding
4. **Auto Summary**: AI-generated summary with key points and action items

### Premium Subscription
- **Tiered Access**: Free users get limited agents, premium users get unlimited
- **Advanced Features**: Enhanced AI capabilities and priority processing
- **Analytics Dashboard**: Detailed insights into usage patterns

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT models that power our AI agents
- **Stream.io** for the excellent video call infrastructure
- **Vercel** for the deployment platform
- **The Next.js team** for the amazing framework

## 📧 Contact

**Pranshu Sharma**
- GitHub: [@PranshuSharma14](https://github.com/PranshuSharma14)
- Email: pranshusharmaindia@gmail.com

---

<div align="center">
  <strong>Built with ❤️ for the future of AI interactions</strong>
</div>
