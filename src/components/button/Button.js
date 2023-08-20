import './Button.css';

const Button = ({children, type, onClick, style, disabled, leftIcon}) => {
  return (
    <button disabled={disabled} className={disabled ? 'disabledButton' : 'button'} style={style} onClick={onClick} type={type}>{leftIcon && leftIcon} {children}</button>
  )
}

export default Button
