export interface OwnerInterface {
    ID?:        number
	FirstName?:	string
	LastName?:	string
	Email?:		string
	Password?:	string
	ProfilePath?:	string
	GenderID?:  number
	[key: string]: any;
}