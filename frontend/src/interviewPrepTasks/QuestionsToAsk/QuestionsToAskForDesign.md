What business problem does it solve?

How does success look for this problem? And what is its metric? How will success be measured for this feature?

What is the required fidelity of this feature between prototype and production; how robust/complete does it need to be?
Do we value quality over speed?

How will this feature integrate with existing systems or components?

Is there a required/defined state management system or would you like me to propose one?
how are we receiving data to populate our components?

What are the design guidelines? I can have a react component that gets state from the parent or calls a state manager. But there is a trade off. If I pass it as a parameter (with callbacks to handle the updates) it is more code but verbose on where the data is coming from. If I get it from the hooks of state manager, the component will be harder then to turn into a dummy component and to replace with a library component because it has a lot of business logic in it

Are there any security considerations to be aware of? Utilize React's Built-in Cross-Site Scripting (XSS) Protection
/<div>{userInput}</div> {} turns everything into plain text - string escape
Be Cautious with dangerouslySetInnerHTML
Validate and Sanitize User Inputs - that is where types come important

Responsive - one design that scales
Adaptive - multiple designs for different sizes

performance requirements/concerns (size budget, lighthouse score, etc.)
compatibility requirements/concerns (ie11 god forbid)
device requirements/concerns (mobile designs, mobile first, responsive vs adaptive, etc.)
accessibility requirements/concerns (aria, wcag, wai, screen readers, etc.)
light/dark mode as god intended (or other theming / white-labelling requirements)
