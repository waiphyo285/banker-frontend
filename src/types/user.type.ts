export default interface IUser {
  id?: any | null,
  username?: string | null,
  password?: string,
  roles?: Array<string>
  status?: boolean
}