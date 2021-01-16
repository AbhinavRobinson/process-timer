import Axios from 'axios'
import Container, { Service } from 'typedi'

@Service()
export class ApiMainLinks {
	private readonly url = `http://${Container.get('url')}/`

	public AxiosInstance = Axios.create({
		url: this.url,
	})
	async fetchActiveUsers() {
		const active_users = await Axios.get(`${this.url}active_users`)

		return active_users.data
	}
}
