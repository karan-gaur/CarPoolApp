import './Button.css';

interface ButtonProps {
    width?: string;
    height?: string;
    text: string;
    onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ width='w-full' , height, text, onClick }) => {
  return (
    <div className={`flex glow-on-hover justify-center items-center mt-5 p-5 border border-white cursor-pointer ${width} ${height}`} onClick={onClick}>
        {text}
    </div>
  )
}

export default Button