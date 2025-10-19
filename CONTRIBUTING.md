# Contributing to OpenHomepage

First off, thank you for considering contributing to OpenHomepage! It's people like you that make OpenHomepage such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and encourage diverse points of view
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Your First Code Contribution

Unsure where to begin? You can start by looking through `good-first-issue` and `help-wanted` issues:

- **Good first issues** - issues which should only require a few lines of code
- **Help wanted issues** - issues which may be more involved

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow the code style** of the project
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Ensure tests pass** (if applicable)
6. **Write clear commit messages**
7. **Submit a pull request**

## Development Setup

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/williamloree/OpenHomepage.git
cd OpenHomepage

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```text
OpenHomepage/
├── app/                  # Frontend application
│   ├── components/       # Reusable Vue components
│   ├── composables/      # Vue composables (state management)
│   ├── middleware/       # Route middleware
│   ├── pages/            # Page components
│   ├── widgets/          # Widget components
│   └── assets/           # CSS and images
├── server/               # Backend API
│   ├── api/              # API endpoints
│   └── db/               # Database files
├── public/               # Static assets
└── nuxt.config.ts        # Nuxt configuration
```

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces for data structures
- Avoid using `any` when possible

### Vue Components

- Use Composition API with `<script setup>`
- Keep components focused and single-purpose
- Use meaningful prop and emit names
- Document complex component logic

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Use meaningful variable and function names
- Keep functions small and focused

### Example Component

```vue
<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  description: 'Default description'
})
</script>
```

## Adding a New Widget

To add a new widget to OpenHomepage:

1. **Create widget component** in `app/widgets/YourWidget.vue`
2. **Define props interface** for widget configuration
3. **Implement the widget** using Vue Composition API
4. **Test the widget** in the admin panel
5. **Update documentation** if needed

### Widget Template

```vue
<template>
  <div class="p-6 rounded-sm bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
    <h3>{{ title }}</h3>
    <p>{{ content }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  content?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'My Widget',
  content: 'Widget content'
})
</script>
```

## Commit Message Guidelines

Write clear and meaningful commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests when relevant

### Examples

```text
Add weather widget with OpenMeteo API integration

Fix authentication redirect issue in admin panel

Update README with Docker deployment instructions

Refactor link management component for better performance
```

## Testing

Before submitting a pull request:

1. **Test all changed functionality**
2. **Test on different screen sizes** (responsive design)
3. **Test in different browsers** (Chrome, Firefox, Safari)
4. **Check for console errors**
5. **Verify no regressions** in existing features

## Documentation

- Update the README.md if you change functionality
- Document new features and widgets
- Add JSDoc comments for complex functions
- Update API documentation if you add/modify endpoints

## Getting Help

If you need help:

- Check the [README](README.md)
- Look at existing [issues](https://github.com/williamloree/OpenHomepage/issues)
- Ask in [discussions](https://github.com/williamloree/OpenHomepage/discussions)
- Join our community chat (if applicable)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:

- The project's README
- Release notes for their contributions
- The GitHub contributors page

Thank you for contributing to OpenHomepage!
