import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Input, Rating, AirbnbRating } from 'react-native-elements';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}




const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment, id) => dispatch(postComment(dishId, rating, author, comment, id))
})

function RenderComments(props) {

   

    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>

                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <View style={styles.stars}>
                    <Rating readonly imageSize={15} startingValue={item.rating} ratingCount={6} />
                </View>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (

        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comments' >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

class DishDetail extends Component {


    constructor(props) {
        super(props);

        this.state = {
            author: "",
            comment: "",
            rating: 5,
            showModal: false
        }
        this.ratingCompleted = this.ratingCompleted.bind(this);
        
    }

    static navigationOptions = {
        title: 'Dish Details',
        drawerPosition: 'left'
    };

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    resetForm() {
        this.setState({
            author: "",
            comment: "",
            showModal: false,
            rating: 5,
        });
    }

    handleComment() {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
    }

    addComment(dishId, rating, author, comment, id) {
        this.props.postComment(dishId, rating, author, comment, id)
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }



    ratingCompleted(rating) {
        this.setState({ rating: rating })
    }



    render() {
        
       

        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <View>
                    <RenderDish dish={this.props.dishes.dishes[+dishId]}
                        favorite={this.props.favorites.some(el => el === dishId)}
                        onPress={() => this.markFavorite(dishId)}
                        onPressAddComent={() => this.handleComment()}
                        openCommentModal={() => this.toggleModal()}
                    />
                </View>
                <View>
                    <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                </View>
                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={styles.modal}>

                        <Rating showRating fractions={1} startingValue={5} ratingCount={5} onFinishRating={this.ratingCompleted} />
                        <View style={{ margin: 20, marginTop: 45 }}>
                            <Input leftIcon={{ type: 'font-awesome', name: 'user-o' }} placeholder='Author' onChangeText={author => this.setState({ author })} />
                            <Input leftIcon={{ type: 'font-awesome', name: 'comment-o' }} style={{ marginBottom: 10 }} placeholder='Comment' onChangeText={comment => this.setState({ comment })} />
                        </View>
                        <View style={styles.formRow}>
                            <Button
                                onPress={() => { this.addComment(dishId, this.state.rating, this.state.author, this.state.comment, this.props.comments.comments.length); this.toggleModal(); this.resetForm(); }}
                                color="#512DA8"
                                title="Submit"
                                style={{ marginTop: 30 }}
                                accessibilityLabel="Post your comment"
                            />
                        </View>
                        <View style={styles.formRow}></View>
                        <Button
                            onPress={() => { this.toggleModal(); this.resetForm(); }}
                            color="#7D7F7D"
                            title="Cancel"
                            style={{ marginTop: 10 }}
                        />
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

function RenderDish(props) {

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
            dialogTitle: 'Share ' + title
        })
    }
    const dish = props.dish;
    
    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    }


    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if ( dx > 200 )
            return true;
        else
            return false;
    }
    

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000).
            then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},

        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );
                else if (recognizeComment(gestureState))
                {
                    props.openCommentModal();
                }

            return true;
        }
    })


    

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000} 
             ref={this.handleViewRef}
            {...panResponder.panHandlers}>
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={styles.formRow}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.onPressAddComent()}
                        />
                         <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            style={styles.cardItem}
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}


const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 15
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    },
    stars: {
        flex: 1,
        textAlign: 'left',
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);