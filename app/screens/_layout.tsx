import { Stack } from 'expo-router';

export default function TabLayout() {
    return (
        <Stack
            screenOptions={{
                presentation: 'modal',
                animation: 'fade_from_bottom',
                headerStyle: {
                    backgroundColor: '#185545',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20,
                },
            }}
        >
            <Stack.Screen name="CreateCourseScreen"
                options={{
                    title: 'Criar Curso'
                }} />
            <Stack.Screen name="CreateMonitorScreen"
                options={{
                    title: 'Criar Monitor'
                }} />
            <Stack.Screen name="CreateNoticeScreen"
                options={{
                    title: 'Criar Aula de Monitoria'
                }} />
            <Stack.Screen name="CreateStudentScreen"
                options={{
                    title: 'Adicionar Estudante'
                }} />
        </Stack>
    );
}
