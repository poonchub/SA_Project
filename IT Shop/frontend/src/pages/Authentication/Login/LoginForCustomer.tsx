import { useState, useEffect } from "react";
import { message } from "antd";
import { SignInInterface } from "../../../Interfaces/ISignIn";
import { CreateCustomer, GetCustomerByID, GetGenders, SignInForCustomer } from "../../../services/http";
import "./LoginForCustomer.css";
import { Link } from "react-router-dom";
import { CustomerInterface } from "../../../Interfaces/ICustomer";
import { GendersInterface } from "../../../Interfaces/IGender";
import dayjs from "dayjs";

function LoginForCustomer() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [birthday, setBirthday] = useState("");
	const [genders, setGenders] = useState<GendersInterface[]>([]);
	const [genderID, setGenderID] = useState(1);

	const [isSignupActive, setIsSignupActive] = useState(false);
	const [messageApiLogin, contextHolderLogin] = message.useMessage();

	async function getGender(){
		const res = await GetGenders()
		if (res) {
			setGenders(res);
		}
	}

	async function onFinishSignIn(e: any) {
		e.preventDefault();
		const data: SignInInterface = {
			Email: email,
			Password: password,
		};
		let resSignin = await SignInForCustomer(data);
		if (resSignin) {
			messageApiLogin.success("Sign-in successful");
			localStorage.setItem("isLogin", "true");
			localStorage.setItem("token_type", resSignin.token_type);
			localStorage.setItem("token", resSignin.token);
			localStorage.setItem("id", resSignin.id);

			let resGetCustomer = await GetCustomerByID(resSignin.id);

			localStorage.setItem("firstName", resGetCustomer.FirstName);
			localStorage.setItem("lastName", resGetCustomer.LastName);
			localStorage.setItem("profilePath", resGetCustomer.ProfilePath);

			setTimeout(() => {
				location.href = "/";
			}, 2000);
		} else {
			messageApiLogin.error("Email or Password is Incorrect");
		}
	}

	async function onFinishSignUp(e: any) {
		e.preventDefault();
		const birthDayFormatted = birthday ? dayjs(birthday).format('YYYY-MM-DDTHH:mm:ss[Z]') : "";
		console.log(birthDayFormatted)
		const data: CustomerInterface = {
			FirstName: firstName,
			LastName: lastName,
			Email: email,
			Password: password,
			PhoneNumber: phoneNumber,
			Birthday: birthDayFormatted,
			GenderID: genderID
		};
		let resSignin = await CreateCustomer(data);
		if (resSignin) {
			messageApiLogin.success("Sign-in successful");

			setTimeout(() => {
				location.href = "/Login-Customer";
			}, 2000);
		} else {
			messageApiLogin.error("Sign Up Error !!!");
		}
	}

	useEffect(() => {
		getGender()

		const bgColorBox = document.querySelector(".bg-color-box");
		const formSignupContainer = document.querySelector(".form-signup-container");
		const formSigninContainer = document.querySelector(".form-signin-container");
		const toggleToSignup = document.querySelector(".toggle-to-signup");
		const toggleToSignin = document.querySelector(".toggle-to-signin");

		if (isSignupActive) {
			bgColorBox?.classList.add("active");
			formSignupContainer?.classList.add("active");
			formSigninContainer?.classList.add("active");
			toggleToSignup?.classList.add("active");
			toggleToSignin?.classList.add("active");
		} else {
			bgColorBox?.classList.remove("active");
			formSignupContainer?.classList.remove("active");
			formSigninContainer?.classList.remove("active");
			toggleToSignup?.classList.remove("active");
			toggleToSignin?.classList.remove("active");
		}
	}, [isSignupActive]);

	return (
		<div className="login-customer-container">
			{contextHolderLogin}
			<div className="form-login-container">
				<div className="bg-color-box"></div>
				<div className="toggle-to-signup">
					<h1 className="title-detail">Welcome, Customer!</h1>
					<span className="span-detail">If you don't have a user account yet, You can easily create an account here.</span>
					<button className="tg-signup-btn" onClick={() => setIsSignupActive(true)}>SIGN UP</button>
				</div>
				<div className="toggle-to-signin">
					<h1 className="title-detail">Welcome, Customer!</h1>
					<span className="span-detail">If you already have a user account You can fill out the information. To log in here.</span>
					<button className="tg-signin-btn" onClick={() => setIsSignupActive(false)}>SIGN IN</button>
				</div>
				<div className="form-signin-container">
					<form onSubmit={onFinishSignIn} className="signin-form">
						<span className="title">Sign <span>In</span></span>
						<input
							type="email"
							placeholder="Email"
							className="email-input in-box"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<input
							type="password"
							placeholder="Password"
							className="password-input in-box"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<input type="submit" className="submit-btn" value={"SIGN IN"} />
					</form>
					<Link className="back" to="/">Back To Home</Link>
				</div>
				<div className="form-signup-container">
					<form onSubmit={onFinishSignUp} className="signup-form">
						<span className="title">Sign <span>Up</span></span>
						<input
							type="text"
							placeholder="First Name"
							className="firstName-input in-box"
							onChange={(e) => setFirstName(e.target.value)}
							required
						/>
						<input
							type="text"
							placeholder="Last Name"
							className="lastName-input in-box"
							onChange={(e) => setLastName(e.target.value)}
							required
						/>
						<input
							type="email"
							placeholder="Email"
							className="email-input in-box"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<input
							type="password"
							placeholder="Password"
							className="password-input in-box"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<input
							type="tel"
							placeholder="Phone Number (123-456-7890)"
							className="pn-input in-box"
							pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
							onChange={(e) => setPhoneNumber(e.target.value)}
							required
						/>
						<div className="half-input">
							<input
								type="text"
								placeholder="Date Of Birth"
								className="dob-input in-box"
								onFocus={(e) => (e.target.type = 'date')}
								onBlur={(e) => !e.target.value && (e.target.type = 'text')}
								onChange={(e) => setBirthday(e.target.value)}
								required
							/>
							<select 
								className="in-box" 
								onChange={(e)=>setGenderID(Number(e.target.value))}
								required
							>
								<option value="" disabled selected hidden>Gender</option>
								{
									genders.map((item, index)=>(
										<option key={index} value={item.ID}>{item.Name}</option>
									))
								}
							</select>				
						</div>
						<input type="submit" className="submit-btn" value={"SIGN UP"} />
					</form>
					<Link className="back" to="/">Back To Home</Link>
				</div>
			</div>
		</div>
	);
}

export default LoginForCustomer;