import DashboardPage from '@/components/dashboard-page';
import CreateProject from '@/app/dashboard/projects/components/create-project';
import ProjectList from '@/app/dashboard/projects/components/project-list';
import PageTitle from '@/components/page-title';

export default function ProjectsPage() {
    return (
        <DashboardPage>
            <div className='flex justify-between items-center'>
                <PageTitle>My Projects</PageTitle>
                <CreateProject />
            </div>
            <ProjectList />
        </DashboardPage>
    );
}
