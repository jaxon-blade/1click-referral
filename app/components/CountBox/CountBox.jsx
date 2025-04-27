import { Box, Card, Text } from '@shopify/polaris'
import React from 'react'

const CountBox = ({ title, count = 0 }) => {
    return (
        <Card>
            <Box paddingBlock={'400'}>
                <Text variant='headingLg'>{title}</Text>
            </Box>
            <Box paddingBlock>
                <Text variant='headingLg'>{count}</Text>
            </Box>
        </Card>
    )
}

export default CountBox