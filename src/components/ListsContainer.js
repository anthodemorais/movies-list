import React, { Component } from 'react';
import swal from 'sweetalert';
import { getMovies } from '../requests';
import Modal from './Modal';

class ListsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            page: 1,
            isMax: false,
            shouldDisplayModal: false,
            modalMovie: 0,
        }
        this.container = React.createRef()
    }

    // checks if the bottom of the container is above the bottom of the page
    containerIsInViewport = () => {
        if (!this.container) return true
        const bottom = this.container.current.getBoundingClientRect().bottom
        return bottom > window.innerHeight
    }

    // if window height + current scroll Y == total scrollable height then fetch more movies
    handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if (!this.state.isMax) {
            getMovies(this.state.page, (failed, reachedMax, newPage, nextMovies) => {
                if (!failed) {
                    nextMovies.shift()
                    this.setState({
                        isMax: reachedMax,
                        page: newPage,
                        movies: this.state.movies.concat(nextMovies)
                    })
                }
            })
        }
    }

    showModal = (id) => {
        this.setState({
            modalMovie: id,
            shouldDisplayModal: true
        });
    }

    hideModal = () => {
        this.setState({
            modalMovie: 0,
            shouldDisplayModal: false
        });
    }

    componentDidMount() {
        getMovies(1, (failed, reachedMax, newPage, nextMovies) => {
            if (!failed) {
                this.setState({
                    isMax: reachedMax,
                    page: newPage,
                    movies: nextMovies
                })

                // if the list is smaller than the screen then fetch more movies to enable scrolling
                if (!this.containerIsInViewport()) {
                    getMovies(newPage, (f, max, p, m) => {
                        if (!f) {
                            this.setState({
                                isMax: max,
                                page: p,
                                movies: nextMovies.concat(m)
                            })
                        }
                        else {
                            swal('Oops...', 'Cannot get movies, try again later...', 'error')
                        }
                    })
                }
            }
            else {
                swal('Oops...', 'Cannot get movies, try again later...', 'error')
            }
        })

        window.addEventListener('scroll', this.handleScroll);
    }



    render() { 
        return (
            <>
                <h1>The popular movies list</h1>
                <strong>Click on a movie to see its details !</strong>
                <ul className="list-group" ref={this.container}>
                    {this.state.movies.map(movie => {
                        return (
                            <li
                                key={movie.id}
                                onClick={() => this.showModal(movie.id)}
                                className="list-group-item btn btn-link"
                            >
                                {movie.title}
                            </li>
                        )
                    })}
                </ul>
                {this.state.shouldDisplayModal && <Modal id={this.state.modalMovie} hideModal={() => this.hideModal()} />}
            </>
        );
    }
}
 
export default ListsContainer;