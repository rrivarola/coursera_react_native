import React, { Component } from 'react'
import { View, Text, ScrollView, FlatList, Modal, StyleSheet, Button } from 'react-native'
import { Card, Icon, Rating, Input } from 'react-native-elements'
import { connect } from 'react-redux'
import { baseUrl } from '../shared/baseUrl'
import { postFavorite, postComment } from '../redux/ActionCreators'

const mapStateToProps = state => {
    return{
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props) {
    
    const dish = props.dish
    
    if(dish != null){
        return(
            <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}
            >
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <View style={{flexDirection:'row', alignSelf:'center'}}>
                    <Icon
                        raised
                        reverse
                        name={props.favorite ? 'heart' : 'heart-o' }
                        type='font-awesome'
                        color={'#f50'}
                        onPress={() => props.favorite ? console.log('Already favorite') : props.markFavorite()}
                        />
                    <Icon
                        raised
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color={'#512DA8'}
                        onPress={() => props.toggleModal()}
                    />
                </View>
            </Card>
        )
    }
    else{
        return(<View></View>)
    }
}

function RenderComments(props) {
    const comments = props.comments

    const renderCommentItem = ({item, index}) => {
        console.log(item)
        return(
            <View key={index} style={{margin:10, alignItems: 'flex-start'}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <View style={{ marginTop: 5, marginBottom: 5}}>
                    <Rating 
                        startingValue={parseInt(item.rating)} 
                        imageSize={10}
                        readonly
                    />
                </View>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date}</Text>
            </View>
        )
    }

    return(
        <Card title="Comments">
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()} />
        </Card>
    )

} 

class DishDetail extends Component {

    constructor(props){
        super(props)
        this.state = {
            showModal: false,
            author: '',
            comment:'',
            rating: 1
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId)
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    static navigationOptions = {
        title: 'Dish Details'
    }
    
    resetForm() {
        this.setState({
            showModal: false,
            author: '',
            comment:'',
            rating: 1
        })
    }

    setAuthor(text) {
        this.setState({author: text})
    }

    setComment(text) {
        this.setState({comment: text})
    }

    setRating(value) {
        this.setState({rating: value})
    }

    handleComment(dishId, rating, author, comment){
        this.props.postComment(dishId, rating, author, comment)
    }

    render() {

        const dishId = this.props.navigation.getParam('dishId', '')

        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]} 
                    favorite={this.props.favorites.some(el => el === dishId)}
                    markFavorite={() => this.markFavorite(dishId)}
                    toggleModal={() => this.toggleModal()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal
                    animationType='slide'
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => {
                        this.toggleModal()
                        this.resetForm()
                    }}
                    onRequestClose={() => {
                        this.toggleModal()
                        this.resetForm()
                    }}
                    >
                    <View style={styles.modal}>
                        <Rating 
                            showRating
                            minValue={1}
                            value={this.state.rating}
                            onFinishRating={(rating) => this.setRating(rating)}
                        />
                        <Input
                            inputStyle={{paddingLeft: 10}}
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'user-o', color:'black'}}
                            value={this.state.author}
                            onChangeText={(text) => this.setAuthor(text)}
                        />
                        <Input
                            inputStyle={{paddingLeft: 10}}
                            placeholder='Comment'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o', color:'black'}}
                            value={this.state.comment}
                            onChangeText={(text) => this.setComment(text)}
                        />
                        <View style={{margin: 20}}>
                            <View style={{paddingBottom: 20}}>
                                <Button
                                    title='Submit'
                                    onPress={() => {
                                        this.handleComment(dishId, this.state.rating, this.state.author, this.state.comment)
                                        this.toggleModal()
                                    }}
                                    color='#512DA8'
                                />
                            </View>
                            <View style={{paddingBottom: 20}}>
                                <Button
                                    title='Cancel'
                                    onPress={() => {
                                        this.toggleModal()
                                        this.resetForm()
                                    }}
                                    color='grey'
                                />
                            </View>
                        </View>
                    </View>      
                </Modal>
            </ScrollView>
        )
    }
    
}

const styles = StyleSheet.create({
    modal:{
        justifyContent: 'center',
        padding: 20
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail)

