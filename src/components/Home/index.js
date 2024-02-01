import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import ProjectCard from '../ProjectCard'
import {
  BgContainer,
  SelectCategoryInput,
  ProjectsContainer,
  LoaderContainer,
  FailureContainer,
  FailureImage,
  FailureHeading,
  FailureInfo,
  FailureRetryButton,
} from './styledComponents'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    activeId: categoriesList[0].id,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjects()
  }

  onChange = event => {
    this.setState(
      {
        activeId: event.target.value,
      },
      () => this.getProjects(),
    )
  }

  getProjects = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {activeId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickRetry = () => {
    this.getProjects()
  }

  renderFailureView = () => (
    <FailureContainer>
      <FailureImage
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <FailureHeading>Oops! Something Went Wrong</FailureHeading>
      <FailureInfo>
        We cannot seem to find the page you are looking for.
      </FailureInfo>
      <FailureRetryButton type="button" onClick={this.onClickRetry}>
        Retry
      </FailureRetryButton>
    </FailureContainer>
  )

  renderLoaderView = () => (
    <LoaderContainer data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </LoaderContainer>
  )

  renderProjectsList = () => {
    const {projectsList} = this.state

    return (
      <ProjectsContainer>
        {projectsList.map(each => (
          <ProjectCard key={each.id} projectCardDetails={each} />
        ))}
      </ProjectsContainer>
    )
  }

  renderProjects = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectsList()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeId} = this.state
    return (
      <>
        <Header />
        <BgContainer>
          <SelectCategoryInput value={activeId} onChange={this.onChange}>
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </SelectCategoryInput>
          {this.renderProjects()}
        </BgContainer>
      </>
    )
  }
}

export default Home
