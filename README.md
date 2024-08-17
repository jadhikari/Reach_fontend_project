This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# React Js — 8 best practices + Folder Structure

1. Directory structure
2. Focus on common modules
3. Add custom components in folders
4. Create custom hooks
5. Use absolute imports
6. Avoid a single context for everything
7. Separate business logic from UI
8. Use the utils directory

# 1. Directory structure

The most important advantage of this folder structure is developers cab can grasp all the files that belong to a feature at once. Plus, it’s easier to maintain the code and reuse it as per their needs.

**Example**

React project has a source (src) folder where all the files and folders get listed, as shown below. The focus should also be on component-centric file structure:

![](https://miro.medium.com/v2/resize:fit:700/1*w6bwaBeN-ZCEnPAr7sIbyw.png)

Folder structure

# 2. Focus on common modules

React doesn’t enforce a particular way of structuring your code. Therefore, you can divide your modules however you want while building a React application. React framework will assist you in reducing the development complexity and creating open, reusable, and shared structures.

So you should focus on common modules such as reusable custom components, custom react hooks, business logic, constants, utility functions, etc. You can use these modules right through the software in various components, views, and projects.

# 3. Add custom components in folders

Adding custom components in folders helps keep projects organized and easier to navigate. It separates standard components from custom components, making them reusable, accessible, and maintainable, and enhancing scalability.

**Example**

Let’s take an example of a React custom button component. In the component directory, create a new folder named “Button.” Within this nested folder, all the files as shown below:

```
└── /src

├── /components

| ├── /Button

| | ├── Button.js

| | ├── Button.css

| | ├── Button.test.js
```

* **Button.js** comprises all the logic of the custom component.
* **Button.css** contains the styled-comonents part.
* **Button.test.js** comprises all the test cases.

# 4. Create custom hooks

Custom hooks helps you to reduce code complexity. Suppose you have two different web pages called Login and Registration. Both of these pages will have input fields where visitors will enter the required information, and click the submit button at the end.

If you want the password toggling feature for both these pages, you must write the same code twice. That’s where the role of the custom hook comes into the picture. You can create a custom hook for password toggling, as shown below:

```
└── /src
├── /hooks
├──usePasswordToggler.js
```

# 5. Use absolute imports

React application comprises plenty of nested structures, which may lead to confusion when importing any element by default.

```
// some file
import { Button } from '../../components';
```

You can avoid such confusion by adding support for importing modules using absolute paths. For this purpose, you can add a rule to the jsconfig.json file at the root of your project. A jsconfig.json file helps your editor’s Language Server Protocol to comprehend JavaScript or JSX (A JavaScript Extension).

Here’s an example of how jsconfig.json can help:

```
{
"compilerOptions": {
"baseUrl": "src"
},
"include": ["src"]
}
```

With a rule added to the jsconfig.json file, you can import components located at /src/components with the following coding snippet:

```
import { Button } from 'components';
```

# 6. Avoid a single context for everything

One of the most common problems in a React application is figuring out how to share the current state across multiple components. The complexity can multi-fold when several components exist between a parent and child component, requiring the passing of render props between them.

React Context is essential for transmitting data via component tree without restoring to default prop drilling. It means a parent component can pass on the props to all the child components beneath. Using multiple contexts in your React application can help you avoid a single point of failure and accomplish various tasks effectively.

# 7. Separate business logic from UI

To enhance the quality of your source code and make software maintenance a breeze, you should separate business logic from UI. The main component i.e., UI should get stored in the /pages or /views directory. Building custom hooks can help you to solve this problem. You can also use the React Query library, a custom hook that helps you to fetch, catch and update the content.

# 8. Use the utils directory

The utils directory comprises some helper functions that you can use right through your React application. It’s not compulsory to utilize the utils directory. However, it’s recommended as it assists in maintaining a clean code and enhancing software quality.

So far, we have gone through the nitty-gritty of best practices and folder/structure changes that can help you to create a scalable web application. However, the question still remains-how to create one/what are the steps involved? Let us find out in our next section.
