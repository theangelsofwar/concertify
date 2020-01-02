import React from 'react';
import {Button, SafeAreaView, FlatList, Linking, StyleSheet, Image, Text, View} from 'react-native';
import EventPage from './EventPage';
import config from './../config.js'

export interface HomePageProps {
    eventArray: Object
}

export interface HomePageState {
    searched: Boolean,
    searchInput: String,
    eventArray: Object
}

class HomePage extends React.Component<HomePageProps, HomePageState> {
    constructor(props: HomePageProps) {
        super(props);
        this.state = {
            searched: true,
            searchInput: '',
            eventArray: [],
        };
        this.searchEvents = this.searchEvents.bind(this)
    }

    setSearchInput() {
        this.setState({
            // searchInput: event.target.value
        })
    }

    searchEvents() {
        const holdingArr = [];
        fetch(`https://app.ticketmaster.com/discovery/v2/events.json?stateCode=ca&classificationName="Alternative Rock"&apikey=${config.ticketApi}`)
            .then(data => data.json())
            .then(data => data._embedded.events)
            .then(data => {
                for (let i = 0; i < data.length; i += 1) {
                    // holdingArr.push(
                    //     <View>
                    //         <Text>{data[i].name}</Text>
                    //         {/*<Image source={{uri: data[i].images[8]}} />*/}
                    //         <Text>{data[i].dates.start.localDate}</Text>
                    //         <Button title={'Get Tickets'} onPress={() => Linking.openURL(data[i].url)}/>
                    //     </View>)
                    holdingArr.push({name: data[i].name, venue: data[i]._embedded.venues[0].name, image: data[i].images[8], date: data[i].dates.start.localDate, url: data[i].url})
                }})
            .then(data => this.setState({eventArray: holdingArr}))
            .catch(error => console.log(error))
    }


    render() {
        const eventPage = this.state.searched ? <EventPage eventArray={this.state.eventArray} /> : null;

        return (
            <SafeAreaView style={styles.container}>
                <Button title={'Search'} onPress={() => {this.searchEvents()}} />
                {/*<View>{this.state.eventArray}</View>*/}
                <FlatList data={this.state.eventArray} renderItem={({ item }) =>
                    <View>
                        <Text>{item.name}</Text>
                        <Text>{item.date}</Text>
                        <Text>{item.venue}</Text>
                        <Button title={'Get Tickets'} onPress={() => Linking.openURL(item.url)}/>
                    </View>
                } />
                {/*{ eventPage }*/}

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default HomePage;
