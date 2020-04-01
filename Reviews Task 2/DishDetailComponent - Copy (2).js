import React, {Component} from 'react';
import {View, Text, ScrollView, StyleSheet, Modal} from 'react-native';
import {Card, Icon, Button, Rating, Input} from 'react-native-elements';
import {connect} from 'react-redux';
import {baseUrl} from "../shared/baseUrl";
import {postFavorite, postComment} from "../redux/ActionCreators";

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
};

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

function RenderDish(props) {
    const dish = props.dish;

    if (dish != null) {
        return (
            <Card featuredTitle={dish.name}
                  image={{uri: baseUrl + dish.image}}>
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <View style={styles.leftAlignedRow}>
                    <Icon
                        raised
                        reverse
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#F50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPressFavorite()}/>
                    <Icon
                        raised
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color='#512DA8'
                        onPress={() => props.onPressComment()}/>
                </View>
            </Card>
        );
    } else {
        return (<View/>)
    }
}

function RenderComments(props) {
    const comments = props.comments;

    return (
        <Card title='Comments'>
            {
                comments.map((item, index) => {
                    return (
                        <View key={index} style={{margin: 10}}>
                            <Text style={{fontSize: 14}}>
                                {item.comment}
                            </Text>
                            <Rating type='star' imageSize={12}
                                    style={{alignItems: 'left'}} startingValue={item.rating}/>
                            <Text style={{fontSize: 12}}>
                                {'--' + item.author + ', ' + item.date}
                            </Text>
                        </View>
                    )
                })
            }
        </Card>
    )
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            // these 3 are from the add comment form
            newComment: '',
            newCommentAuthor: '',
            newCommentRating: 0
        }
    }

    markFavorite(dishId) {
        //this.setState({favorites: this.state.favorites.concat(dishId)})
        this.props.postFavorite(dishId);
    }


    static navigationOptions = {
        title: 'Dish Details',
        headerStyle: {
            backgroundColor: '#512DA8',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                            favorite={this.props.favorites.some(el => el === dishId)}
                            onPressFavorite={() => this.markFavorite(dishId)}
                            onPressComment={() => this.toggleModal()}/>
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)}/>
                <Modal animationType='slide'
                       transparent={false}
                       presentationStyle='fullScreen'
                       visible={this.state.showModal}>
                    <View style={styles.modal}>
                        <Rating type='star'
                                style={styles.rating}
                                onFinishRating={(rating) => this.setState({newCommentRating: rating})}
                                showRating
                                minValue={1}
                                ratingCount={5}
                                fractions={0}
                                startingValue={1}/>
                        <Input placeholder='  Author'
                               placeholderTextColor='#D3D3D3'
                               leftIcon={
                                   <Icon
                                       name='user'
                                       type='font-awesome'/>}
                               onChangeText={(author) => this.setState({newCommentAuthor: author})}/>
                        <Input placeholder='  Comment'
                               placeholderTextColor='#D3D3D3'
                               leftIcon={
                                   <Icon
                                       name='comment'
                                       type='font-awesome'/>}
                               onChangeText={(comment) => this.setState({newComment: comment})}/>
                        <View style={styles.centerAlignedRow}>
                            <Button title='Submit'
                                    titleStyle={styles.buttonTitle}
                                    buttonStyle={styles.submitButton}
                                    onPress={() => {
                                        this.props.postComment(dishId, this.state.newCommentRating, this.state.newCommentAuthor, this.state.newComment);
                                        this.toggleModal();
                                    }}/>
                            <Button title='Cancel'
                                    titleStyle={styles.buttonTitle}
                                    buttonStyle={styles.cancelButton}
                                    onPress={() => this.toggleModal()}/>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    centerAlignedRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 30,
    },
    leftAlignedRow: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F5FCFF',
    },
    cancelButton: {
        margin: 5,
        backgroundColor: '#808080',
    },
    submitButton: {
        margin: 5,
        backgroundColor: '#512DA8',
    },
    buttonTitle: {
        color: '#F5FCFF'
    },
    rating: {
        margin: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F5FCFF',
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);