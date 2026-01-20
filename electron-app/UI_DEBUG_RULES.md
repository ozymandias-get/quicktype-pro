# UI Debugging & Quality Rules

This document defines the strict rules for UI development and debugging in this project.
All components must adhere to these standards.

## 1. Code Cleanliness & Hygiene
*   **No Console Logs**: Production code must not contain `console.log`. Use a custom logger or `console.debug` only in development environments.
    *   *Rule*: `forbidden-console-log`
*   **No Dead Code**: Commented-out code blocks must be removed.
    *   *Rule*: `no-dead-code`

## 2. Maintainability & Structure
*   **Component Size**: Components exceeding 250 lines should be refactored into smaller sub-components or custom hooks.
    *   *Rule*: `max-component-size`
*   **Hardcoded Values**: Magic numbers (timeouts, pixel values) and strings (URLs, keys) must be extracted to a `constants.js` or configuration file.
    *   *Rule*: `no-magic-numbers`

## 3. Error Handling & User Feedback
*   **Visual Feedback**: user actions (clicks, submits) must show immediate feedback (loading spinner, disabled state).
    *   *Rule*: `interaction-feedback`
*   **Graceful Failures**: Network or async errors must display a UI toast/alert, not just crash or do nothing.
    *   *Rule*: `visible-error-handling`

## 4. Accessibility (a11y)
*   **Semantic HTML**: Use `<button>` for clickable elements, not `div` or `span`.
    *   *Rule*: `semantic-elements`
*   **Labels**: Inputs must have associated labels or `aria-label`.
    *   *Rule*: `input-labels`

## 5. Performance
*   **Memoization**: Use `useCallback` and `useMemo` for functions/values passed to child components to prevent unnecessary re-renders.
    *   *Rule*: `proper-memoization`
