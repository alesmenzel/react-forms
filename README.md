# react-forms
`react-forms` provides a [higher order component](https://facebook.github.io/react/docs/higher-order-components.html) for managing form state in [React](https://github.com/facebook/react).
## Motivation
- Do you need to interact with your form data globally from your application?
- Do you use Redux time travel features to record user interaction?

If your answers are `No, I don´t.` to both of those questions, then [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) 
to handle your form state.
## Instalation
```
npm install --save react-forms
```
External dependencies:
```
npm install --save react prop-types 
```
## Examples
This example shows a simple form:
First we need to define how are the inputs displayed (i.e. twitter [bootstrap](http://getbootstrap.com/css/#forms), [material-ui](https://github.com/callemall/material-ui)/[react-toolbox](https://github.com/react-toolbox/react-toolbox) or your custom components)
Let´s define a simple input that only displays a given value and that handles value change (without validation or error messages)
```jsx
const MyInput = (props) => {
  return (
    <input 
      type={props.type} 
      value={props.value} 
      onChange={(e) => props.onChange(e.target.value)}
      onBlur={props.onBlur}
    />
  )
}
```
Here we define the actual form component, the only thing we need to pass in a way of handling the submitting. In our 
case `onSubmit` is a simple action that performs an remote API call to our backend.
```jsx
import { Form, Field } from 'react-forms'

const MyForm = ({onSubmit}) => {
  
  // One way of handling the submitting (see Redux section for handling submitting in Redux)
  onSubmit = (values) => {
      // Do your async calls or optionally you could use redux+side-effect library (thunk, saga, ...) to handle your submit action, i.e.:
      axios.post('/api/login', values)
      .then((res) => {
        // ...handle result
      }, (err) => {
        // ...handle errors
      })
    };
  
  return (
    <Form onSubmit={onSubmit}>
      <Field name="username" label="Jméno" value="JohnDoe">
        <MyInput type="text"/>
      </Field>
      <Field name="password" label="Jméno" value="SecretPassword123">
        <MyInput type="password"/>
      </Field>
      <input type="submit" value={"Submit"}/>
    </Form>
  )
}
```
### Using Redux to handle your submit actions
You can of course use Redux and a side effect library of your choice (thunk, saga, ...) to handle your API calls if you want.
Here is a sample:
```jsx
// container component
import { connect } from 'react-redux'
import { submitMyForm } from './actions'
import MyForm from './MyForm'

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: values => dispatch(submitMyForm(values))
  }
}

const MyConnectedForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyForm)

export default MyConnectedForm
```
And the actions
```jsx
export const request = (payload) => ({
	type: 'REQUEST_INIT',
	payload
});

export const success = (payload) => ({
	type: 'REQUEST_SUCCESS',
	payload
});

export const failure = (payload) => ({
	type: 'REQUEST_FAILURE',
	payload
});

// Thunk
export const submitMyForm = (values) => {
  return (dispatch, getState) => {
    // Initialize the request
    dispatch(request(values))
    // Do the requesting with {insert your favorite library here}
    axios.post('/api/login', values)
    .then((res) => {
      // handle data
      dispatch(success(res.data))
    }, (err) => {
      // handle errors
      dispatch(failure(err.response.data))
    })
  }
}
```
### API
#### Field
Each Field component is passed these props:
Field handlers:

Key | Description | Signature
--- | --- | ---
`onChange` | Handles input changes, accepts the new input value | `onChange(value)`
`onFocus` | Focus event handler | `onFocus(event)`
`onBlur` | Blurring event handler, upon blurring the field is marked as touched | `onBlur(event)`
`onReset` | Resets the field to its initial value | `onReset()`

Field values:

Key | Type | Description
--- | --- | ---
`name` | string | Field name 
`label` | string | Field label (is passed to the validation functions) 
`initialValue` | * | Initial value
`value` | * | Current field value 
`pristine` | boolean | User has NOT interacted with the field yet
`dirty` | boolean | User has interacted with the field
`touched` | boolean | Field has lost focus
`untouched` | boolean | Field has NOT yet lost focus
`valid` | boolean | All validation rules passes
`invalid` | boolean | Some of the validation rules are not met
`focused` | boolean | Field is focused
`errors` | Array<string> | Array of error messages from validation rules, ordered by the order of validation rules

#### Form
Key | Description | Signature
--- | --- | ---
`onSubmit` | Will be fired only when the form is valid. You must call the callback after with optional error object.  | `onSubmit(values, callback)`

### Validation
#### Using the default validation functions.

Notice we are using different syntax for inputs, instead of passing children we are giving the component as a prop (`component`)
and we pass other props from the Field component (`type="text"`).
```jsx
import { isEmail, isRequired } from 'react-forms'

// Pass in a message
const email = isEmail('Invalid email address')
// Pass in a function that returns a message
const required = isRequired((key, val, meta) => `Field ${meta.label} is required`)

const MyForm = ({onSubmit}) => {
  return (
    <Form onSubmit={onSubmit}>
      <Field name="email" label="Email" validate={email} component={MyInput} type="text"/>
      <Field name="another_email" label="Required email" validate={[required, email]} component={MyInput} type="text"/>
      <input type="submit" value={"Submit"}/>
    </Form>
  )
}
```
As you can see the validate prop accepts both functions and array of functions. In case of array, all rules must be valid.

Built in validators:
Name | Description | Signutare
--- | --- | ---
isEmail | Checks for a valid email address (uses [isemail](https://github.com/hapijs/isemail) module) | isEmail(msg)

#### Using custom validation functions
You can also create a custom validator function. Here is a sample:
```jsx
import { getMessage } from 'react-forms'

export const isNumberEight = msg => {
  // enable passing a string or a function
  const getMessage = getFunction(msg)

  return (name, val, options, next) => {
    if (val !== 8) {
      return next(getMessage(name, val, options))
    }

    return next()
  }
}
```

### Transformation
Prop | Description
--- | ---
`parse` | Parses the input (i.e. Date -> string)
`transform` | Transforms the value before its saved in the state (i.e. toUpperCase)
`format` | Formats the value from state (i.e. string -> Date) 

### Value lifecycle
`onChange(value)` -> `parse(value)` -> `transform(value)` -> { state } -> `format(value)`

### Contributing
The main goal of this repository is to make working with react forms easy without forcing to use other technologies, like Redux.
### [Code of Conduct](./CODE_OF_CONDUCT.md)
We adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### License
This project is licensed under the terms of the [MIT license](./LICENCE).
