import React, { Component } from 'react'
import swal from 'sweetalert';
import { getMovieDetails } from '../requests';
import './styles/modal.css'

class Modal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            movie: {}
        }
    }

    componentDidMount() {
        getMovieDetails(this.props.id, (error, data) => {
            if (!error) {
                console.log(data)
                this.setState({ movie: data })
            }
            else {
                swal('Oops...', 'Cannot get movie, try again later...', 'error')
                this.props.hideModal()
            }
        })
    }

    render() {
        if (Object.keys(this.state.movie).length > 0) {
            return (
                <div
                    className="modal_container"
                    onClick={() => this.props.hideModal()}
                >
                    <div className="modal card">
                        <div className="card-body">
                            <strong className="card-title">
                                {this.state.movie.title} - {this.state.movie.release_date}
                            </strong>
                            <span className="card-subtitle mb-2 text-muted">
                                Original title : {this.state.movie.original_title}
                            </span>
                            <p>
                                <strong>By :</strong> 
                                {this.state.movie.production_companies.map(prod => prod.name).join(", ")}
                            </p>
                            <p>
                                <strong>Genres :</strong>
                                {this.state.movie.genres.map(genre => genre.name).join(", ")}
                            </p>
                            <p>
                                Budget : ${this.state.movie.budget} - Revenue ${this.state.movie.revenue}
                            </p>
                            <p>{this.state.movie.overview}</p>
                        </div>
                    </div>
                </div>
            );
        }
        
        return ( <div></div> )
    }
}
 
export default Modal;