# Future Trends and Signals System (FTSS)
The [Future Trends and Signals System](https://signals.data.undp.org) captures signals of change noticed across UNDP, and identifies the trends emerging – helping us all make stronger, more future-aware decisions. This repository hosts the codebase for the front-end application written in React.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

- React front end bootstrapped with Vite.
- Application design aligned with the UNDP Design System.
- RBAC – signal scanners, curators, admins.
- JWT-based authentication based on Microsoft Entra.

## Technologies Used

- **React**: Used as MVC framework.
- **styled-components**: Utilizes tagged template literals and the power of CSS, allows to write actual CSS code to style the components in JS/TS.
- **Various D3 Libraries**: Used for visualizations, adding interaction and reading the csv data file.
- **AntD**: For UI elements like dropdown, buttons, checkbox, and slider.
- **dom-to-image**: Used to allow users to download images of various visualization views they create.
- **lodash**: Used for manipulating and iterating arrays and objects.
- **axios**: Used for API calls.
- **@azure/msal-browser and @azure/msal-react**: Used for Azure SSO.
- **@react-pdf/renderer**: Used for generating PDFs.

## Getting Started

### Prerequisites

This project uses `npm`. You will need to install `node` and `npm`, if you don't already have it. `node` and `npm` can be installed from [here](https://nodejs.org/en/download/).

### Global CSS for UI and Graphs

**Git Repo**: https://github.com/UNDP-Data/stylesheets-for-viz

**Link for stylesheets**
- https://undp-data.github.io/stylesheets-for-viz/style/mainStyleSheet.css
- https://undp-data.github.io/stylesheets-for-viz/style/StyleForGraphingInterface.css
- https://undp-data.github.io/stylesheets-for-viz/style/StyleForGraph.css

### Installation

To install the project, clone the repo and run `npm install` in the project folder. You can use terminal on Mac and Command Prompt on Windows.

This project is bootstrapped with [`Vite`](https://vitejs.dev/) and was created using `npm create vite@latest` command.

Run the terminal or command prompt and then run the following

```shell
git clone https://github.com/undp-data/fe-signals-and-trends.git
cd fe-ftss
npm install
```

### Local Development

To start the project locally, you can run `npm run dev` in the project folder in terminal or command prompt. This will run the app in development mode. Open [http://localhost:5173/](http://localhost:5173/) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

To deploy locally successfully you will need to make some changes to the `Constants.tsx`: 

- `export const WEB_ADDRESS = 'https://signals.data.undp.org/';` to `export const WEB_ADDRESS = './';`
- `export const API_ACCESS_TOKEN = process.env.INPUT_ACCESS_TOKEN_FOR_API';` to `export const API_ACCESS_TOKEN = import.meta.env.VITE_ACCESS_CODE`
- `export const REDIRECT_URL = process.env.INPUT_REDIRECT_URI_FOR_MSAL;` to `export const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;`

These changes are only required for local deployment. For production, you will need to keep the value same.

Also you will need a `.env.local` file in the root folder. the `env` file would require the following variable and values

```
VITE_API_LINK=https://signals-and-trends-api.azurewebsites.net/v1/
VITE_ACCESS_CODE={{contact the team for API secret}}
VITE_REDIRECT_URL=http://localhost:5173/
```

### Tooling Setup

This project uses ESLint integrated with prettier, which verifies and formats your code so you don't have to do it manually. You should have your editor set up to display lint errors and automatically fix those which it is possible to fix. See [http://eslint.org/docs/user-guide/integrations](http://eslint.org/docs/user-guide/integrations).

This project is build in Visual Studio Code, therefore the project is already set up to work with. Install it from [here](https://code.visualstudio.com/) and then install [eslint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint). Once this is done, you should be good to go.

### Back-end API

The application interfaces with the back-end API. See the [documentation](https://signals-and-trends-api.azurewebsites.net/docs) for user roles, authentication and endpoints.

## Usage

* `npm run dev`: Executes `vite` and start the local server for local deployment.
* `npm run build`: Executes `tsc && vite build` and builds the app for production and deployment.

## Deployment

The application CI/CD to Azure Static Web App and automatically deployed on changes to `production` or `staging`.

- `production` is deployed to the [production environment](https://signals.data.undp.org).
- `staging` is deployed to the [staging environment]() (TBA).

## Contributing

All changes must go through a pull request and code review. Changes are to be merged to `staging` first. To contribute:

1. **Fork the Repository**: Click the "Fork" button at the top right of the repository page to create your own copy.
2. **Create a New Branch off the `staging` branch**: Use a descriptive name for your branch that reflects the feature or fix you are working on:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Make Your Changes**: Implement your feature or fix. Ensure your code adheres to the project's coding standards.
4. **Test Your Changes**: Run the application locally to verify that your changes work as expected and do not introduce any new issues.
5. **Commit Your Changes**: Write a clear and concise commit message:
   ```bash
   git commit -m "Add feature: YourFeatureDescription"
   ```
6. **Push to Your Branch**: Push your changes to your forked repository:
   ```bash
   git push origin feature/YourFeatureName
   ```
7. **Open a Pull Request to `staging`**: Go to the original repository and click on "New Pull Request." Provide a detailed description of your changes and why they should be merged.

When merging from `staging` to `main`, make sure to merge with rebase.

