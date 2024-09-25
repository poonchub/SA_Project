import { useState } from "react";
import { message } from "antd";
import { SignInInterface } from "../../../Interfaces/ISignIn";
import { GetOwnerByID, SignInForOwner } from "../../../services/http";
import "./LoginForOwner.css"
import { Link } from "react-router-dom";

function LoginForOwner() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [messageApiLogin, contextHolderLogin] = message.useMessage();

	async function onFinish(e: any) {
		e.preventDefault();
		const data: SignInInterface = {
			Email: email,
			Password: password
		}
		let resSignin = await SignInForOwner(data);
		if (resSignin) {
			messageApiLogin.success("Sign-in successful");
			localStorage.setItem("isLogin", "true");
            localStorage.setItem("loginByOwner", "true")
			localStorage.setItem("token_type", resSignin.token_type);
			localStorage.setItem("token", resSignin.token);
			localStorage.setItem("owner_id", resSignin.id);

            let resGetOwner = await GetOwnerByID(resSignin.id)

            localStorage.setItem("firstName", resGetOwner.FirstName);
			localStorage.setItem("lastName", resGetOwner.LastName);
            localStorage.setItem("OwnerprofilePath", resGetOwner.ProfilePath);

			setTimeout(() => {
				location.href = "/";
			}, 2000);
		}
		else {
			messageApiLogin.error("Email or Password is Incorrect");
		}
	}

	return (
		<div className="login-owner-container">
			{contextHolderLogin}
			<div className="form-login-container">
				<form onSubmit={onFinish} className="login-form">
					<span className="title">Sign <span>In</span></span>
					<div className="email-box input-box">
						<input
							type="email"
							className="email-input in-box"
							placeholder="Email"
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="password-box input-box">
						<input
							type="password"
							className="password-input in-box"
							placeholder="Password"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className="input-box">
						<input type="submit" className="submit-btn-login" value={"SIGN IN"} />
					</div>
				</form>
                <Link className="back" to='/'>Back To Home</Link>
			</div>
		</div>
	);
}

export default LoginForOwner;
