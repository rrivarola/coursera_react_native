import { Text, View, ScrollView, FlatList, StyleSheet, Modal, Button } from 'react-native';
import { Card, Icon, Input, Rating, AirbnbRating } from 'react-native-elements';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';


const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId))
})

function RenderComments(props) {

    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (
        <Card title='Comments' >
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class DishDetail extends Component {


    constructor(props) {
        super(props);

        this.state = {
            author:"",
            comment:"",
            showModal: false
        }
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
            author:"",
            comment:"",
            showModal: false
        });
    }

    handleComment() {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
    }


    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onPressAddComent={() => this.handleComment()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={styles.modal}>


                        <Rating showRating fractions="{1}" startingValue="{3}" ratingCount={6} />

                        <Input leftIcon={{ type: 'font-awesome', name: 'user-o' }} placeholder='Author'></Input>
                        <Input leftIcon={{ type: 'font-awesome', name: 'comment-o' }} placeholder='Comment'></Input>

                        

                        <View style={styles.formRow}>
                            <Button
                                onPress={() => { this.toggleModal(); this.resetForm(); }}
                                color="#512DA8"
                                title="Submit"
                            />
                        </View>
                        <View style={styles.formRow}></View>
                        <Button
                            onPress={() => { this.toggleModal(); this.resetForm(); }}
                            color="#512DA8"
                            title="Cancel"
                        />
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

function RenderDish(props) {

    const dish = props.dish;

    if (dish != null) {
        return (
            <Card
                featuredTitle={dish.name}
                image={{ uri: baseUrl + dish.image }}>
                <Text style={{ margin: 10 }}>
                    {dish.description}
                </Text>
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
            </Card>
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
        margin: 10
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
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);