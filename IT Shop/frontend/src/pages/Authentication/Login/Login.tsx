import { useContext, useState } from "react";
import { message } from "antd";
import { SignInInterface } from "../../../Interfaces/ISignIn";
import { GetCustomerByID, SignIn } from "../../../services/http";
import "./Login.css"
import { Link } from "react-router-dom";
import AppContext from "antd/es/app/context";

function Login() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [messageApi, contextHolder] = message.useMessage();
    const [customer, setCustomer] =useState()

	async function onFinish(e: any) {
		e.preventDefault();
		const data: SignInInterface = {
			Email: email,
			Password: password
		}
		let resSignin = await SignIn(data);
		if (resSignin) {
			messageApi.success("Sign-in successful");
			localStorage.setItem("isLogin", "true");
			localStorage.setItem("token_type", resSignin.token_type);
			localStorage.setItem("token", resSignin.token);
			localStorage.setItem("id", resSignin.id);

            let resGetCustomer = await GetCustomerByID(resSignin.id)

            localStorage.setItem("firstName", resGetCustomer.FirstName);
            localStorage.setItem("profilePath", resGetCustomer.ProfilePath);

			setTimeout(() => {
				location.href = "/";
			}, 2000);
		}
		else {
			messageApi.error("Email or Password is Incorrect");
		}

        

	}

    async function getCustomer(){
        const id = localStorage.getItem("id")
        if (id !== null) {
            let res = await GetCustomerByID(parseInt(id, 10));
            if (res) {
                setCustomer(res);
            }
        } else {
            console.error("ID is not found in localStorage");
        }
    }

	const Logout = () => {
		localStorage.clear();
		messageApi.success("Logout successful");
		setTimeout(() => {
		  	location.href = "/";
		}, 2000);
	};

	return (
		<div className="login-container">
			{contextHolder}
			<div className="form-container">
				<form onSubmit={onFinish} className="login-form">
					<span className="title">LogIn</span>
					<div className="email-box input-box">
						<label className="email-text text">Email</label>
						<input
							type="email"
							className="email-input"
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="password-box input-box">
						<label className="password-text text">Password</label>
						<input
							type="password"
							className="password-input"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className="btn-box input-box">
						<input type="submit" className="submit-btn btn" value={"Submit"} />
						<button className="btn">Register</button>
					</div>
				</form>
				<button onClick={Logout} style={{ margin: 4 }}>
				ออกจากระบบ
				</button>
                <Link to='/'>Back To Home</Link>
			</div>
		</div>
	);
}

export default Login;
