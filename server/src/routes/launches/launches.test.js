const {describe, test} = require('node:test')
const {deepStrictEqual } = require('node:assert')

const request = require('supertest')
const app = require('../../app')


describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200)
        
    })
})

describe('Test POST /launch', () => {
    const completeLaunchData = {
        mission: 'USS inc.',
        rocket: 'Explorer IS1',
        target: 'Kepler 442 -b',
        launchDate: 'January 4, 20230',
    }

    const launchDataWithoutDate = {
        mission: 'USS inc.',
        rocket: 'Explorer IS1',
        target: 'Kepler 442 -b',
    }

    const launchDataWithInvalidDate = {
        mission: 'USS inc.',
        rocket: 'Explorer IS1',
        target: 'Kepler 442 -b',
        launchDate: 'Zooma',
    }

    test('It should respond with 201 success', async () => {
        const response =await request(app)
        .post('/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201)
        
    const requestDate = new Date(completeLaunchData.launchDate).valueOf()
    const responseDate = new Date(response.body.launchDate).valueOf()
    deepStrictEqual(responseDate, requestDate)
    const { mission, rocket, target} = response.body
    deepStrictEqual({
        mission,
        rocket,
        target
    }, launchDataWithoutDate)

    })
    test('It should catch missing required propertiers', async () =>{
        const response =await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400)

        deepStrictEqual(response.body, {
            error: 'Missing required launch property',
        })
    })
    test('It should catch invalid dates', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400)

        deepStrictEqual(response.body,{
            error: 'Invalid launch date'
        })
    })
})